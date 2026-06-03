describe('Login SauceDemo - Scenari Positivi ed E2E Completo', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', 'inventory');
  });

   it('Bug checkout: non dovrebbe permettere di completare un ordine con carrello vuoto', () => {
    // 1. Va direttamente al carrello (vuoto) cliccando sull'icona
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.url().should('include', 'cart.html');

    // 2. Procede al checkout
    cy.get('[data-test="checkout"]').click();
    cy.url().should('include', 'checkout-step-one.html');

    // 3. Compila i dati di spedizione
    cy.get('[data-test="firstName"]').type('Gabriele');
    cy.get('[data-test="lastName"]').type('Patti');
    cy.get('[data-test="postalCode"]').type('95125');
    cy.get('[data-test="continue"]').click();

    // 4. Verifica che il totale sia effettivamente $0.00
    cy.url().should('include', 'checkout-step-two.html');
    cy.get('[data-test="total-label"]')
      .should('be.visible')
      .and('have.text', 'Total: $0.00');

    // 5. Tenta di finire l'ordine
    cy.get('[data-test="finish"]').click();

    // 6. ASSEZIONE DI FALLIMENTO ATTESO: 
    // Se compare il messaggio "Thank you for your order!", significa che c'è un bug.
    // Usiamo una negazione (.should('not.exist') o 'not.have.text') per far fallire il test in caso di successo anomalo.
    cy.get('[data-test="complete-header"]').should('not.exist');
    
    // In alternativa, se ti aspetti che appaia un messaggio di errore specifico (es. "Cart is empty"), 
    // puoi decommentare la riga sotto e adattarla:
    // cy.get('[data-test="error"]').should('be.visible').and('contain', 'Cart is empty');
  });

});