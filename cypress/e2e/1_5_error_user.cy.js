describe('SauceDemo - Scenari error_user (Bike Light Bug)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('error_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', 'inventory');
  });

  // ========================================================
  // TEST 1: AGGIUNTA AL CARRELLO → deve dare OK
  // ========================================================
  it('Test 1 - Aggiunta della Bike Light al carrello', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    cy.get('[data-test="remove-sauce-labs-bike-light"]')
      .should('be.visible')
      .and('have.text', 'Remove');

    cy.get('.shopping_cart_badge')
      .should('be.visible')
      .and('have.text', '1');
  });

  // ========================================================
  // TEST 2: RIMOZIONE DAL CARRELLO → deve dare KO (bug)
  // ========================================================
  it('Test 2 - Rimozione della Bike Light dal carrello (bug atteso)', () => {
    // Aggiungiamo il prodotto
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('.shopping_cart_badge').should('have.text', '1');

    // Clicchiamo Remove
    cy.get('[data-test="remove-sauce-labs-bike-light"]').click();

    // Il bottone dovrebbe tornare ad "Add to cart", ma per il bug rimane "Remove"
    // → questo fa fallire il test (KO atteso)
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .should('be.visible');

    // Il badge dovrebbe sparire, ma rimane a 1
    // → doppia conferma del bug
    cy.get('.shopping_cart_badge').should('not.exist');
  });
});