describe('Login SauceDemo - Scenari di Errore', () => {

  it('Login fallito - Campi obbligatori vuoti', () => {
    cy.visit('/');
    
    // Clicco direttamente senza scrivere nulla
    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Epic sadface: Username is required');
  });

  it('Login fallito con username corretto e password errata', () => {
    cy.visit('/');

    cy.get('[data-test="username"]')
      .type('standard_user');

    cy.get('[data-test="password"]')
      .type('password_sbagliata');

    cy.get('[data-test="login-button"]')
      .click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Epic sadface: Username and password do not match any user in this service');
  });

  it('Login fallito con username errato e password corretta', () => {
    cy.visit('/');

    cy.get('[data-test="username"]')
      .type('utente_sbagliato');

    cy.get('[data-test="password"]')
      .type('secret_sauce'); 

    cy.get('[data-test="login-button"]')
      .click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Epic sadface: Username and password do not match any user in this service');
  });

});