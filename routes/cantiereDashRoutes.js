const express = require('express');
const db = require('../db/db'); // Connessione al database

const router = express.Router();

// API per ottenere i cantieri e i relativi interventi
router.get('/', async (req, res) => {
  try {
    const [cantieri] = await db.promise().query(`
      SELECT c.ID, c.nome AS titolo, COUNT(i.ID) AS totale_interventi
      FROM cantiere c
      LEFT JOIN intervento i ON c.ID = i.Cantiere
      GROUP BY c.ID
    `);

    const cantieriConInterventi = await Promise.all(
      cantieri.map(async (cantiere) => {
        const [interventi] = await db.promise().query(`
          SELECT descrizione, stato
          FROM intervento
          WHERE Cantiere = ?
        `, [cantiere.ID]);

        const interventiChiusi = interventi.filter((i) => i.stato === 'chiuso').length;

        const progresso = cantiere.totale_interventi > 0
          ? Math.round((interventiChiusi / cantiere.totale_interventi) * 100)
          : 0;

        return {
          ...cantiere,
          interventi: interventi.map((i) => i.descrizione),
          progresso,
        };
      })
    );

    res.status(200).json(cantieriConInterventi);
  } catch (error) {
    console.error('Errore durante il recupero dei cantieri:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei dati.' });
  }
});

module.exports = router;

