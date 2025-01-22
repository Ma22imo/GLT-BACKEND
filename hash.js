const bcrypt = require('bcrypt');
const db = require('./db/db'); // Connessione al database MySQL

const hashPasswords = async () => {
  try {
    // Recupera tutti i responsabili
    const [users] = await db.promise().query('SELECT ID, password FROM responsabile');

    for (const user of users) {
      // Controlla se la password è già hashata
      if (user.password.startsWith('$2b$')) {
        console.log(`Password già hashata per il responsabile con ID: ${user.ID}`);
        continue;
      }

      // Genera un hash per la password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Aggiorna la password hashata nel database
      await db
        .promise()
        .query('UPDATE responsabile SET password = ? WHERE ID = ?', [hashedPassword, user.ID]);

      console.log(`Password hashata per il responsabile con ID: ${user.ID}`);
    }

    console.log('Tutte le password sono state hashate!');
  } catch (err) {
    console.error('Errore durante l’hashing delle password:', err);
  }
};

hashPasswords();
