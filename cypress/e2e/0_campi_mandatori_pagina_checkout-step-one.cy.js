describe('Campi mandatori pagina checkout-step-one.html', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', 'inventory');
  });

// --- FIRST NAME REQUIRED ---

it('Nessun campo compilato → Error: First Name is required', () => {
 cy.get('[data-test="shopping-cart-link"]').click();
 cy.get('[data-test="checkout"]').click();
 cy.get('[data-test="continue"]').click();
 cy.get('[data-test="error"]').should('contain', 'Error: First Name is required');
});

it('Solo Last Name compilato → Error: First Name is required', () => {
 cy.get('[data-test="shopping-cart-link"]').click();
 cy.get('[data-test="checkout"]').click();
 cy.get('[data-test="lastName"]').type('Rossi');
 cy.get('[data-test="continue"]').click();
 cy.get('[data-test="error"]').should('contain', 'Error: First Name is required');
});

it('Solo Postal Code compilato → Error: First Name is required', () => {
 cy.get('[data-test="shopping-cart-link"]').click();
 cy.get('[data-test="checkout"]').click();
 cy.get('[data-test="postalCode"]').type('00100');
 cy.get('[data-test="continue"]').click();
 cy.get('[data-test="error"]').should('contain', 'Error: First Name is required');
});

it('Last Name e Postal Code compilati → Error: First Name is required', () => {
 cy.get('[data-test="shopping-cart-link"]').click();
 cy.get('[data-test="checkout"]').click();
 cy.get('[data-test="lastName"]').type('Rossi');
 cy.get('[data-test="postalCode"]').type('00100');
 cy.get('[data-test="continue"]').click();
 cy.get('[data-test="error"]').should('contain', 'Error: First Name is required');
});

// --- LAST NAME REQUIRED ---

it('Solo First Name compilato → Error: Last Name is required', () => {
 cy.get('[data-test="shopping-cart-link"]').click();
 cy.get('[data-test="checkout"]').click();
 cy.get('[data-test="firstName"]').type('Mario');
 cy.get('[data-test="continue"]').click();
 cy.get('[data-test="error"]').should('contain', 'Error: Last Name is required');
});

it('First Name e Postal Code compilati → Error: Last Name is required', () => {
 cy.get('[data-test="shopping-cart-link"]').click();
 cy.get('[data-test="checkout"]').click();
 cy.get('[data-test="firstName"]').type('Mario');
 cy.get('[data-test="postalCode"]').type('00100');
 cy.get('[data-test="continue"]').click();
 cy.get('[data-test="error"]').should('contain', 'Error: Last Name is required');
});

// --- POSTAL CODE REQUIRED ---

it('First Name e Last Name compilati → Error: Postal Code is required', () => {
 cy.get('[data-test="shopping-cart-link"]').click();
 cy.get('[data-test="checkout"]').click();
 cy.get('[data-test="firstName"]').type('Mario');
 cy.get('[data-test="lastName"]').type('Rossi');
 cy.get('[data-test="continue"]').click();
 cy.get('[data-test="error"]').should('contain', 'Error: Postal Code is required');
});

}); // <-- chiusura del blocco describe