describe('SauceDemo - Scenari di Performance', () => {

  // Esegue la visita alla pagina prima di ognuno dei due test
  beforeEach(() => {
    cy.visit('/');
  });

  // OPZIONE 1: Il test ACCETTA la lentezza e gestisce il timeout (PASSA)
  it('Login con performance_glitch_user - Gestione della latenza tramite Timeout aumentato', () => {
    cy.get('[data-test="username"]').type('performance_glitch_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    // Alziamo il timeout a 6 secondi (6000ms). Il test passerà perché il glitch dura 5 secondi.
    cy.url({ timeout: 6000 }).should('include', 'inventory');
    cy.get('.inventory_list').should('be.visible');
  });

  // OPZIONE 2: Il test MISURA la lentezza e verifica i requisiti SLA (FALLISCE)
  it('Login con performance_glitch_user - Verifica rispetto della soglia di caricamento (SLA 2s)', () => {
    cy.get('[data-test="username"]').type('performance_glitch_user');
    cy.get('[data-test="password"]').type('secret_sauce');

    // Catturiamo il tempo iniziale
    const startTime = performance.now();

    cy.get('[data-test="login-button"]').click();
    
    // Usiamo comunque un timeout alto per dare il tempo a Cypress di calcolare la durata reale senza bloccarsi prima
    cy.url({ timeout: 6000 }).should('include', 'inventory').then(() => {
      // Catturiamo il tempo finale e calcoliamo i secondi reali passati
      const endTime = performance.now();
      const durationSeconds = (endTime - startTime) / 1000;

      // Questo assert fallirà volutamente perché la durata (~5s) è maggiore del limite impostato (2s)
      expect(durationSeconds).to.be.lessThan(2.0, 
        `Il login non rispetta i requisiti di performance! Ci ha messo ${durationSeconds.toFixed(2)} secondi.`
      );
    });
  });

});