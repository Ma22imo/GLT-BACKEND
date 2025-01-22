const express = require('express');
const db = require('../db/db'); // Connessione al database
const router = express.Router();

// API per ottenere i dettagli di un responsabile Endpoint: GET /api/responsabile/:id 
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Ottieni l'ID dal parametro della URL

  try {
    // Query per ottenere i dettagli del responsabile in base all'ID
    const [rows] = await db.promise().query("SELECT Nome, Cognome, nome_utente FROM responsabile WHERE ID = ?", [id]);

    // Se nessun responsabile è trovato, restituisce un errore 404
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Responsabile non trovato.' });
    }

    // Risposta con i dettagli del responsabile
    res.status(200).json(rows[0]);
  } catch (error) {
    // Log dell'errore per il debugging
    console.error('Errore durante il recupero dei dettagli del responsabile:', error);
    res.status(500).json({ message: 'Errore interno del server.' });
  }
});

// API per ottenere tutti i responsabili Endpoint: GET /api/responsabile/ 
router.get('/', async (req, res) => {
  try {
    // Query per ottenere tutti i responsabili
    const [rows] = await db.promise().query(`
      SELECT ID, Nome, Cognome, nome_utente
      FROM responsabile
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore durante il recupero dei responsabili:', error);
    res.status(500).json({ message: 'Errore interno del server.' });
  }
});

module.exports = router;


