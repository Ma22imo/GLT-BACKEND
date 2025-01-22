const express = require('express');
const bcrypt = require('bcrypt'); // Per hashare e confrontare le password
const db = require('../db/db'); // Connessione al database

const router = express.Router();

// API per il login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username e password sono richiesti' });
  }

  try {
    console.log('Dati ricevuti:', { username, password });

    const [rows] = await db.promise().query('SELECT * FROM responsabile WHERE nome_utente = ?', [
      username,
    ]);

    if (rows.length === 0) {
      console.log(`Utente non trovato: ${username}`);
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const user = rows[0];
    console.log('Utente trovato nel database:', user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Risultato del confronto della password:', isPasswordValid);

    if (!isPasswordValid) {
      console.log(`Password errata per l'utente: ${username}`);
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    console.log(`Login effettuato con successo per l'utente: ${username}`);
    return res.status(200).json({
      message: 'Login effettuato con successo!',
      user: {
        id: user.ID,
        nome: user.Nome,
        cognome: user.Cognome,
        username: user.nome_utente,
      },
    });
  } catch (error) {
    console.error('Errore durante il login:', error);
    return res.status(500).json({ message: 'Errore interno del server.' });
  }
});

module.exports = router;
