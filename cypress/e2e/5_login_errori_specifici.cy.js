describe('Gestione Carrello - SauceDemo', () => {

  it('Aggiungere lo zaino al carrello con successo', () => {
    // 1. Facciamo il login con l'utente corretto per entrare nel sito
    cy.visit('/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    // Ora siamo dentro la pagina "inventory" e vediamo lo zaino della tua foto!

    // 2. Verifichiamo che il titolo del prodotto sia corretto
    cy.get('.inventory_item_name')
      .first() // Prende il primo prodotto della lista (lo zaino)
      .should('contain', 'Sauce Labs Backpack');

    // 3. Clicchiamo sul bottone "Add to cart" che vedi nell'immagine
    // Nota: SauceDemo usa data-test specifici per i bottoni dei prodotti
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();

    // 4. Verifichiamo che il carrello in alto a destra mostri il numero "1"
    cy.get('.shopping_cart_badge')
      .should('be.visible')
      .and('text', '1');

    // 5. Opzionale: Il bottone dovrebbe aver cambiato testo in "Remove"
    cy.get('[data-test="remove-sauce-labs-backpack"]')
      .should('contain', 'Remove');
  });

});