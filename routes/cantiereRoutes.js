const express = require('express');
const db = require('../db/db'); // Connessione al database
const router = express.Router();

// Recupera tutti i cantieri
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT c.*, r.Nome AS responsabileNome, r.Cognome AS responsabileCognome FROM cantiere c JOIN responsabile r ON c.responsabile = r.ID order by c.id desc';
    const [rows] = await db.promise().query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Errore nel recupero dei cantieri:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei cantieri.' });
  }
});


// Recupera un cantiere specifico con interventi
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  //console.log(`Richiesta di recupero dettagli cantiere con ID: ${id}`); // Log per debug

  try {
    const cantiereQuery = 'SELECT * FROM cantiere WHERE ID = ?';
    const [cantiereRows] = await db.promise().query(cantiereQuery, [id]);

    if (cantiereRows.length === 0) {
      return res.status(404).json({ message: 'Cantiere non trovato.' });
    }

    const cantiere = cantiereRows[0];

    const interventiQuery = 'SELECT * FROM intervento WHERE Cantiere = ?';
    const [interventiRows] = await db.promise().query(interventiQuery, [id]);

    cantiere.interventi = interventiRows;

    res.status(200).json(cantiere);
  } catch (error) {
    console.error('Errore nel recupero dei dettagli del cantiere:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei dettagli del cantiere.' });
  }
});

// Elimina un cantiere
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  //console.log(`Richiesta di eliminazione cantiere con ID: ${id}`); // Log per debug

  try {
    const query = 'DELETE FROM cantiere WHERE ID = ?';
    const [result] = await db.promise().query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cantiere non trovato.' });
    }

    res.status(200).json({ message: 'Cantiere eliminato con successo!' });
  } catch (error) {
    console.error('Errore nella cancellazione del cantiere:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione del cantiere.' });
  }
});

// POST - Crea un nuovo cantiere
router.post('/', async (req, res) => {
  const { nomeCantiere, dataInizio, dataFine, cliente, luogo, responsabileId } = req.body;
  console.log('Dati ricevuti per la creazione del cantiere:', req.body); // Log per debug

  try {
    const query = 'INSERT INTO cantiere (nome, data_inizio, data_prevista_fine, cliente, luogo, Responsabile) VALUES (?, ?, ?, ?, ?, 1)';
    const [result] = await db.promise().query(query, [
      nomeCantiere,
      dataInizio, // 'YYYY-MM-DD'
      dataFine, // 'YYYY-MM-DD'
      cliente,
      luogo,
      responsabileId,
    ]);

    res.status(201).json({
      message: 'Cantiere creato con successo',
      cantiereId: result.insertId,
    });
  } catch (error) {
    console.error('Errore durante la creazione del cantiere:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

// PUT - Aggiorna un cantiere
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nomeCantiere, dataInizio, dataFine, cliente, luogo, responsabileId } = req.body;

  console.log(`Richiesta di aggiornamento cantiere con ID: ${id}`);
  console.log('Dati ricevuti per l\'aggiornamento:', req.body);

  try {
    const query = 'UPDATE cantiere SET nome = ?, data_inizio = ?, data_prevista_fine = ?, cliente = ?, luogo = ?, Responsabile = ? WHERE ID = ?';
    const [result] = await db.promise().query(query, [
      nomeCantiere,
      dataInizio, // 'YYYY-MM-DD'
      dataFine, // 'YYYY-MM-DD'
      cliente,
      luogo,
      responsabileId,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cantiere non trovato.' });
    }

    res.status(200).json({ message: 'Cantiere aggiornato con successo!' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del cantiere:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del cantiere.' });
  }
});

module.exports = router;
