describe('Login SauceDemo - Scenari Positivi ed E2E Completo', () => {

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
    cy.get('.inventory_item').last().scrollIntoView({ duration: 500 });

    // 2. SALVATAGGIO IN CACHE E AGGIUNTA AL CARRELLO
    cy.get('.inventory_item').last().then(($lastItem) => {
      const savedName = $lastItem.find('[data-test="inventory-item-name"]').text();
      const savedDesc = $lastItem.find('[data-test="inventory-item-desc"]').text();
      const savedPriceText = $lastItem.find('[data-test="inventory-item-price"]').text(); // Es: "$29.99"
      
      // Convertiamo il prezzo in un numero puro per i calcoli successivi (rimuovendo il "$")
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

      // 4. CLICK SU CHECKOUT E COMPILAZIONE FORM (checkout-step-one.html)
      cy.get('[data-test="checkout"]').click();
      cy.url().should('include', 'checkout-step-one.html');

      cy.get('[data-test="firstName"]').type('Gabriele');
      cy.get('[data-test="lastName"]').type('Patti');
      cy.get('[data-test="postalCode"]').type('95125');
      cy.get('[data-test="continue"]').click();

      // ========================================================
      // 5. NUOVO: VERIFICA RIEPILOGO FINALE (checkout-step-two.html)
      // ========================================================
      cy.url().should('include', 'checkout-step-two.html');

      // Verifica presenza label QTY
      cy.get('[data-test="cart-quantity-label"]')
        .should('be.visible')
        .and('have.text', 'QTY');

      // Verifica corrispondenza info del prodotto con la cache di partenza
      cy.get('.cart_item').then(($finalCartItem) => {
        expect($finalCartItem.find('[data-test="inventory-item-name"]').text()).to.eq(savedName);
        expect($finalCartItem.find('[data-test="inventory-item-desc"]').text()).to.eq(savedDesc);
        expect($finalCartItem.find('[data-test="inventory-item-price"]').text()).to.eq(savedPriceText);
      });

      // Verifica corrispondenza dell' "Item total" con il valore iniziale
      cy.get('[data-test="subtotal-label"]')
        .should('be.visible')
        .and('have.text', `Item total: ${savedPriceText}`);

      // CALCOLO DINAMICO TASSE E TOTALE (Algoritmo matematico)
      // Calcoliamo l'8% del prezzo memorizzato e arrotondiamo a 2 cifre decimali
      const expectedTax = parseFloat((savedPriceNumeric * 0.08).toFixed(2)); // 29.99 * 0.08 = 2.40
      const expectedTotal = savedPriceNumeric + expectedTax;                 // 29.99 + 2.40 = 32.39

      // Convalidiamo che il Total visualizzato a schermo sia esattamente quello calcolato
      cy.get('[data-test="total-label"]')
        .should('be.visible')
        .and('have.text', `Total: $${expectedTotal.toFixed(2)}`);

      // 6. CONCLUSIONE DELL'ORDINE
      cy.get('[data-test="finish"]').click();

      // Verifica finale dell'avvenuto ordine (checkout-complete.html)
      cy.url().should('include', 'checkout-complete.html');
    });
  });

});