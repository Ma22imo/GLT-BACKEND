const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Modifica con il tuo utente MySQL
  password: '',  // Modifica con la tua password
  database: 'glt_segnaletica',  // Modifica con il nome del tuo database
  dateStrings: true,
});

db.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database: ', err);
  } else {
    console.log('Connesso al database MySQL');
  }
});

module.exports = db;