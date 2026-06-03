describe('SauceDemo - Scenari problem_user (Bug Immagini)', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('problem_user');
    cy.get('[data-test="password"]').type('secret_sauce');
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

});