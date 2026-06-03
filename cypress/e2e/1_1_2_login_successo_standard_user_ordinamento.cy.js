describe('Login SauceDemo - Scenari Positivi ed E2E', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', 'inventory');
  });

  // ========================================================
  // TEST 1: LOGIN STANDARD (Mantenuto e potenziato con la visibilità del catalogo)
  // ========================================================
  it('Login corretto - Verifica accesso e presenza catalogo', () => {
    cy.get('.inventory_list').should('be.visible');
  });

  // ========================================================
  // TEST 2: ORDINAMENTO E VERIFICA SPOSTAMENTO CARD
  // ========================================================
  it('Verifica ordinamento Name (Z to A) e spostamento del Backpack all\'ultimo posto', () => {
    
    // 1. Prima di ordinare, salviamo i dati del primo prodotto (Sauce Labs Backpack)
    // Usiamo le classi e i data-test che hai fornito
    cy.get('.inventory_item').first().then(($firstItem) => {
      const name = $firstItem.find('[data-test="inventory-item-name"]').text();
      const desc = $firstItem.find('[data-test="inventory-item-desc"]').text();
      const price = $firstItem.find('[data-test="inventory-item-price"]').text();
      const imgSrc = $firstItem.find('.inventory_item_img').attr('src');

      // 2. Eseguiamo l'ordinamento da Z a A usando il selettore del menu a tendina
      cy.get('[data-test="product-sort-container"]').select('za');

      // 3. Verifichiamo che l'elemento precedentemente salvato sia diventato l'ULTIMO della lista
      cy.get('.inventory_item').last().then(($lastItem) => {
        expect($lastItem.find('[data-test="inventory-item-name"]').text()).to.eq(name);
        expect($lastItem.find('[data-test="inventory-item-desc"]').text()).to.eq(desc);
        expect($lastItem.find('[data-test="inventory-item-price"]').text()).to.eq(price);
        expect($lastItem.find('.inventory_item_img').attr('src')).to.eq(imgSrc);
      });
    });
  });

});