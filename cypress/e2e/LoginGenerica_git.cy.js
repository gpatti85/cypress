				
				// =============================================================
// SauceDemo - Suite Completa: Bug standard_user + E2E standard_user
// =============================================================

// ─────────────────────────────────────────────────────────────
// SEZIONE 1: Verifica Bug standard_user
// ─────────────────────────────────────────────────────────────
describe('SauceDemo - Verifica Bug standard_user', () => {
beforeEach(() => {
  cy.visit('/');
  // Usa la variabile d'ambiente di Cypress, se non esiste usa 'standard_user'
  const username = Cypress.env('CYPRESS_USER') || 'standard_user';
  const password = Cypress.env('CYPRESS_PASSWORD') || 'secret_sauce';

  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
  cy.url().should('include', 'inventory');
});



  it('Verifica che le immagini dei prodotti siano corrette e distinte', () => {
    // 1. Prendo tutti i tag img dentro i box dei prodotti
    cy.get('.inventory_item_img img')
      .should('have.length.gt', 0) // Verifica che ci siano immagini caricate
      .then(($imgs) => {
        // 2. Trasformo la lista di elementi in un array di stringhe (i percorsi 'src')
        const srcAttributes = [...$imgs].map(img => img.getAttribute('src'));

        // 3. Inserisco l'array in un Set per eliminare i duplicati
        const uniqueSrcs = new Set(srcAttributes);

        // 4. Asserzione: Se le immagini sono diverse, la dimensione del Set deve essere > 1.
        // Con il problem_user le immagini sono tutte uguali (dimensione = 1), quindi il test darà KO!
        expect(uniqueSrcs.size).to.be.greaterThan(1, 
          'Bug Rilevato! Tutte le immagini dei prodotti mostrano lo stesso identico asset (il cane).'
        );
      });
  });
  
  
  it('Bug immagini: le src dei prodotti non corrispondono ai nomi', () => {
    const expectedImages = {
      'sauce labs backpack': 'sauce-backpack',
      'sauce labs bike light': 'bike-light',
      'sauce labs bolt t-shirt': 'bolt-shirt',
      'sauce labs fleece jacket': 'sauce-pullover',
      'sauce labs onesie': 'red-onesie',
      'test.allthethings() t-shirt (red)': 'red-tatt'
    };

    cy.get('.inventory_item').each(($item) => {
      const name = $item.find('[data-test="inventory-item-name"]').text().toLowerCase();
      const imgSrc = $item.find('.inventory_item_img img').attr('src').toLowerCase();

      const expectedKeyword = expectedImages[name];
      if (expectedKeyword) {
        expect(imgSrc).to.include(expectedKeyword,
          `Prodotto "${name}": l'immagine "${imgSrc}" non contiene "${expectedKeyword}"`);
      }
    });
  });

  it('Bug ordinamento: il prezzo resta associato al prodotto dopo sort Z→A', () => {
    const priceMap = {};

    cy.get('.inventory_item').each(($item) => {
      const name = $item.find('[data-test="inventory-item-name"]').text();
      const price = $item.find('[data-test="inventory-item-price"]').text();
      priceMap[name] = price;
    });

    // Seleziona Z→A e VERIFICA che il dropdown abbia effettivamente cambiato valore
    cy.get('[data-test="product-sort-container"]').select('za');
    cy.get('[data-test="product-sort-container"]').should('have.value', 'za');

    cy.get('.inventory_item').each(($item) => {
      const name = $item.find('[data-test="inventory-item-name"]').text();
      const price = $item.find('[data-test="inventory-item-price"]').text();
      expect(price).to.equal(priceMap[name],
        `Il prezzo di "${name}" è cambiato dopo il sort: atteso ${priceMap[name]}, trovato ${price}`);
    });
  });

  it('Bug ordinamento: la descrizione resta associata al prodotto dopo sort Z→A', () => {
    const descMap = {};

    cy.get('.inventory_item').each(($item) => {
      const name = $item.find('[data-test="inventory-item-name"]').text();
      const desc = $item.find('[data-test="inventory-item-desc"]').text();
      descMap[name] = desc;
    });

    cy.get('[data-test="product-sort-container"]').select('za');
    cy.get('[data-test="product-sort-container"]').should('have.value', 'za');

    cy.get('.inventory_item').each(($item) => {
      const name = $item.find('[data-test="inventory-item-name"]').text();
      const desc = $item.find('[data-test="inventory-item-desc"]').text();
      expect(desc).to.equal(descMap[name],
        `La descrizione di "${name}" è cambiata dopo il sort`);
    });
  });

  it('Bug ordinamento: i nomi sono effettivamente in ordine Z→A dopo selezione', () => {
    cy.get('[data-test="product-sort-container"]').select('za');
    cy.get('[data-test="product-sort-container"]').should('have.value', 'za');

    cy.get('[data-test="inventory-item-name"]')
      .then(($names) => {
        const names = [...$names].map((el) => el.innerText);
        const sorted = [...names].sort((a, b) => b.localeCompare(a));
        expect(names).to.deep.equal(sorted);
      });
  });

  it('Bug ordinamento: i nomi sono in ordine A→Z di default', () => {
    // Verifica che il dropdown sia su A→Z di default
    cy.get('[data-test="product-sort-container"]').should('have.value', 'az');

    cy.get('[data-test="inventory-item-name"]')
      .then(($names) => {
        const names = [...$names].map((el) => el.innerText);
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).to.deep.equal(sorted);
      });
  });

  it('Bug ordinamento: i prezzi sono effettivamente in ordine High→Low dopo selezione', () => {
    const pricesBeforeSort = [];

    cy.get('[data-test="inventory-item-price"]').each(($price) => {
      const numericPrice = parseFloat($price.text().replace('$', ''));
      pricesBeforeSort.push(numericPrice);
    });

    cy.then(() => {
      const expectedOrder = [...pricesBeforeSort].sort((a, b) => b - a);

      // Seleziona High→Low e VERIFICA che il dropdown abbia cambiato valore
      cy.get('[data-test="product-sort-container"]').select('hilo');
      cy.get('[data-test="product-sort-container"]').should('have.value', 'hilo');

      cy.get('[data-test="inventory-item-price"]').then(($prices) => {
        const actualPrices = [...$prices].map((el) => parseFloat(el.innerText.replace('$', '')));
        expect(actualPrices).to.deep.equal(expectedOrder);
      });
    });
  });



  it('Bug carrello: il badge torna a zero dopo Remove', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });
});

// ─────────────────────────────────────────────────────────────
// SEZIONE 2: Flusso E2E con standard_user
// ─────────────────────────────────────────────────────────────
describe('SauceDemo - Flusso E2E standard_user', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', 'inventory');
  });

  it('Flusso E2E: Ordinamento Z-A, Carrello, Checkout e Validazione Calcolo Tasse (8%)', () => {
    
    // 1. ORDINAMENTO E SCROLL
    cy.get('[data-test="product-sort-container"]').select('za');
    cy.get('[data-test="product-sort-container"]').should('have.value', 'za');
    cy.get('.inventory_item').last().scrollIntoView({ duration: 500 });

    // 2. SALVATAGGIO IN CACHE E AGGIUNTA AL CARRELLO
    cy.get('.inventory_item').last().then(($lastItem) => {
      const savedName = $lastItem.find('[data-test="inventory-item-name"]').text();
      const savedDesc = $lastItem.find('[data-test="inventory-item-desc"]').text();
      const savedPriceText = $lastItem.find('[data-test="inventory-item-price"]').text();
      const savedPriceNumeric = parseFloat(savedPriceText.replace('$', ''));

      cy.wrap($lastItem).find('.btn_inventory').click();

      // REGRESSIONE CARRELLO
      cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');
      cy.get('[data-test="shopping-cart-link"]').click();

      // 3. PAGINA CARRELLO (cart.html)
      cy.url().should('include', 'cart.html');
      cy.get('.cart_item').then(($cartItem) => {
        expect($cartItem.find('[data-test="inventory-item-name"]').text()).to.eq(savedName);
        expect($cartItem.find('[data-test="inventory-item-desc"]').text()).to.eq(savedDesc);
        expect($cartItem.find('[data-test="inventory-item-price"]').text()).to.eq(savedPriceText);
      });

      // 4. CLICK SU CHECKOUT E COMPILAZIONE FORM
      cy.get('[data-test="checkout"]').click();
      cy.url().should('include', 'checkout-step-one.html');

      cy.get('[data-test="firstName"]').type('Gabriele');
      cy.get('[data-test="lastName"]').type('Patti');
      cy.get('[data-test="postalCode"]').type('95125');
      cy.get('[data-test="continue"]').click();

      // 5. VERIFICA RIEPILOGO FINALE
      cy.url().should('include', 'checkout-step-two.html');

      cy.get('[data-test="cart-quantity-label"]')
        .should('be.visible')
        .and('have.text', 'QTY');

      cy.get('.cart_item').then(($finalCartItem) => {
        expect($finalCartItem.find('[data-test="inventory-item-name"]').text()).to.eq(savedName);
        expect($finalCartItem.find('[data-test="inventory-item-desc"]').text()).to.eq(savedDesc);
        expect($finalCartItem.find('[data-test="inventory-item-price"]').text()).to.eq(savedPriceText);
      });

      cy.get('[data-test="subtotal-label"]')
        .should('be.visible')
        .and('have.text', `Item total: ${savedPriceText}`);

      const expectedTax = parseFloat((savedPriceNumeric * 0.08).toFixed(2));
      const expectedTotal = savedPriceNumeric + expectedTax;

      cy.get('[data-test="total-label"]')
        .should('be.visible')
        .and('have.text', `Total: $${expectedTotal.toFixed(2)}`);

      // 6. CONCLUSIONE DELL'ORDINE
      cy.get('[data-test="finish"]').click();
      cy.url().should('include', 'checkout-complete.html');
    });
  });
});