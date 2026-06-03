describe('Login SauceDemo - Scenari Positivi ed E2E con Carrello', () => {

  // FA COSA: Viene eseguito prima di iniziare il test. Garanzia di isolamento.
  beforeEach(() => {
    cy.visit('/'); // 1. Naviga sulla home page
    cy.get('[data-test="username"]').type('standard_user'); // 2. Inserisce lo username
    cy.get('[data-test="password"]').type('secret_sauce');  // 3. Inserisce la password
    cy.get('[data-test="login-button"]').click();           // 4. Clicca sul Login
    cy.url().should('include', 'inventory');                // 5. Verifica l'avvenuto atterraggio
  });

  it('Verifica ordinamento Name (Z to A), aggiunta al carrello e convalida dati in cart.html', () => {
    
    // FA COSA: Interagisce con il menu a tendina (<select>) e seleziona il valore 'za'
    cy.get('[data-test="product-sort-container"]').select('za');

    // FA COSA: Trova l'ultimo articolo (.last()) e forza un'azione di scorrimento 
    // fluida di 500 millisecondi per renderlo visibile a schermo nel runner grafico.
    cy.get('.inventory_item').last().scrollIntoView({ duration: 500 });

    // FA COSA: Apre una "closure" (un blocco logico di manipolazione) sull'oggetto individuato
    cy.get('.inventory_item').last().then(($lastItem) => {
      
      // CREAZIONE CACHE: Estrae le stringhe di testo HTML della card in quel preciso istante
      // e le salva in costanti JavaScript che sopravvivono al cambio di pagina.
      const savedName = $lastItem.find('[data-test="inventory-item-name"]').text();
      const savedDesc = $lastItem.find('[data-test="inventory-item-desc"]').text();
      const savedPrice = $lastItem.find('[data-test="inventory-item-price"]').text();

      // FA COSA: Esegue il click sul pulsante "Add to cart" relativo a quella specifica card
      cy.wrap($lastItem).find('.btn_inventory').click();

      // FA COSA: Verifica istantanea che il contatore del badge sia salito a '1'
      cy.get('[data-test="shopping-cart-badge"]')
        .should('be.visible')
        .and('have.text', '1');

      // FA COSA: Clicca sul link del carrello per avviare la navigazione
      cy.get('[data-test="shopping-cart-link"]').click();

      // FA COSA: Asserzione di navigazione per confermare il caricamento della nuova pagina
      cy.url().should('include', 'cart.html');

      // FA COSA: Ispeziona la riga del prodotto inserito nel carrello
      cy.get('.cart_item').then(($cartItem) => {
        // Estrae i testi correnti presenti all'interno della pagina del carrello
        const currentName = $cartItem.find('[data-test="inventory-item-name"]').text();
        const currentDesc = $cartItem.find('[data-test="inventory-item-desc"]').text();
        const currentPrice = $cartItem.find('[data-test="inventory-item-price"]').text();

        // CONFRONTO CON LA CACHE: Verifica che i dati estratti adesso siano identici
        // a quelli memorizzati prima dello scroll e del click.
        expect(currentName).to.eq(savedName);
        expect(currentDesc).to.eq(savedDesc);
        expect(currentPrice).to.eq(savedPrice);
      });

      // FA COSA: Verifica finale di consistenza dei pulsanti d'azione presenti nel footer del carrello
      cy.get('[data-test="continue-shopping"]')
        .should('be.visible')
        .and('contain.text', 'Continue Shopping');

      cy.get('[data-test="checkout"]')
        .should('be.visible')
        .and('have.text', 'Checkout');

      cy.get('[data-test="remove-sauce-labs-backpack"]')
        .should('be.visible')
        .and('have.text', 'Remove');

      // FA COSA: Si assicura che lo stato del badge persista anche nella schermata cart.html
      cy.get('[data-test="shopping-cart-badge"]')
        .should('be.visible')
        .and('have.text', '1');
    });
  });

});