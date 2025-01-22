// routes/interventoRoutes.js
const express = require('express');
const db = require('../db/db'); // Connessione al database
const router = express.Router();

// Recupera tutti gli interventi per un cantiere specifico
router.get('/:id/interventi', async (req, res) => {
  const { id } = req.params;
  console.log(`Richiesta di recupero interventi per cantiere ID: ${id}`); // Log per debug

  try {
    const query = 'SELECT * FROM intervento WHERE Cantiere = ?';
    const [rows] = await db.promise().query(query, [id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore nel recupero degli interventi:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli interventi.' });
  }
});

module.exports = router;
