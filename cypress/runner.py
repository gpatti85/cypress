import subprocess
import sys
import os

# 1. Definizione della batteria di test da eseguire
TEST_SUITE = [
    "cypress/e2e/1_6_login_visual_user_checkout-step-two.cy.js",
    # Puoi aggiungere qui sotto tutti gli altri file .js o .ts che vuoi includere
    # "cypress/e2e/2_1_altro_test.cy.js",
    # "cypress/e2e/3_4_gestione_carrello.cy.js",
]

def run_cypress_tests():
    print(f"=== Avvio della batteria di test ({len(TEST_SUITE)} file individuati) ===")
    
    # Trasformiamo la lista dei file in una stringa separata da virgole per Cypress
    specs_to_run = ",".join(TEST_SUITE)
    
    # Costruiamo il comando di base: npx cypress run --spec "file1,file2"
    command = ["npx", "cypress", "run", "--spec", specs_to_run]
    
    try:
        # Eseguiamo il comando ereditando le variabili d'ambiente (es. USER e PASSWORD di GitHub Actions)
        result = subprocess.run(command, check=True, text=True)
        print("=== Batteria di test completata con successo! ===")
        sys.exit(result.returncode)
        
    except subprocess.CalledProcessError as e:
        print(f"=== Errore durante l'esecuzione dei test! codice d'uscita: {e.returncode} ===")
        sys.exit(e.returncode)

if __name__ == "__main__":
    run_cypress_tests()