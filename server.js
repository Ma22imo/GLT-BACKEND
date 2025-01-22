const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db/db'); // Connessione al database MySQL

// Import delle rotte
const loginRoutes = require('./routes/loginRoutes'); // Rotte per il login
const cantiereDashRoutes = require('./routes/cantiereDashRoutes'); // Rotte per i cantieri e interventi
const badgeRespRoutes = require('./routes/badgeRespRoutes'); // Rotte per il responsabile
const cantiereRoutes = require('./routes/cantiereRoutes'); // Rotte per i cantieri
const interventoRoutes = require('./routes/interventoRoutes');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotte
app.use('/api/login', loginRoutes);           // Rotte relative al login
app.use('/api/cantieriDash', cantiereDashRoutes);   // Rotte relative ai cantieri e interventi
app.use('/api/badge', badgeRespRoutes); // Rotte relative ai responsabili
app.use('/api/cantieri', cantiereRoutes); // Rotte relative ai cantieri
app.use('/api/interventi', interventoRoutes);

// Test di connessione al server
app.get('/', (req, res) => {
  res.send('Server è attivo e funzionante!');
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});

