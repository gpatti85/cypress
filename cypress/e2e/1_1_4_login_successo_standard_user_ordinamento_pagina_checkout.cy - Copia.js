describe('Login SauceDemo - Scenari Positivi ed E2E Completo', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', 'inventory');
  });

  it('Flusso E2E: Ordinamento Z-A, Carrello, Validazione Dati e Compilazione Checkout', () => {
    
    // 1. ORDINAMENTO E SCROLL
    cy.get('[data-test="product-sort-container"]').select('za');
    cy.get('.inventory_item').last().scrollIntoView({ duration: 500 });

    // 2. SALVATAGGIO IN CACHE E AGGIUNTA AL CARRELLO
    cy.get('.inventory_item').last().then(($lastItem) => {
      const savedName = $lastItem.find('[data-test="inventory-item-name"]').text();
      const savedDesc = $lastItem.find('[data-test="inventory-item-desc"]').text();
      const savedPrice = $lastItem.find('[data-test="inventory-item-price"]').text();

      cy.wrap($lastItem).find('.btn_inventory').click();

      // REGRESSIONE CARRELLO
      cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');
      cy.get('[data-test="shopping-cart-link"]').click();

      // 3. PAGINA CARRELLO (cart.html)
      cy.url().should('include', 'cart.html');

      // Verifica corrispondenza dati con la cache
      cy.get('.cart_item').then(($cartItem) => {
        expect($cartItem.find('[data-test="inventory-item-name"]').text()).to.eq(savedName);
        expect($cartItem.find('[data-test="inventory-item-desc"]').text()).to.eq(savedDesc);
        expect($cartItem.find('[data-test="inventory-item-price"]').text()).to.eq(savedPrice);
      });

      // 4. DI RECENTE AGGIUNTO: CLICK SU CHECKOUT E TRANSIZIONE
      cy.get('[data-test="checkout"]').click();

      // Verifica atterraggio sullo Step One del Checkout
      cy.url().should('include', 'checkout-step-one.html');

      // 5. COMPILAZIONE FORM DI SPEDIZIONE
      // Usiamo i data-test dei campi input che hai fornito
      cy.get('[data-test="firstName"]').type('Gabriele');
      cy.get('[data-test="lastName"]').type('Patti');
      cy.get('[data-test="postalCode"]').type('95125');

      // 6. INVIO DEL FORM E VERIFICA CAMBIO PAGINA
      // Clicchiamo sul pulsante di submit "Continue"
      cy.get('[data-test="continue"]').click();

      // Verifica che la pagina sia cambiata, passando allo step successivo (Overview/Riepilogo)
      cy.url().should('include', 'checkout-step-two.html');
    });
  });

});