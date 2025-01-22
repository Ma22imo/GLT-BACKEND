const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db/db'); // Connessione al database MySQL

// Import delle rotte
const loginRoutes = require('./routes/loginRoutes'); 
const cantiereDashRoutes = require('./routes/cantiereDashRoutes'); 
const badgeRespRoutes = require('./routes/badgeRespRoutes'); 
const cantiereRoutes = require('./routes/cantiereRoutes'); 
const interventoRoutes = require('./routes/interventoRoutes');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotte
app.use('/api/login', loginRoutes);           
app.use('/api/cantieriDash', cantiereDashRoutes);   
app.use('/api/badge', badgeRespRoutes); 
app.use('/api/cantieri', cantiereRoutes);
app.use('/api/interventi', interventoRoutes);

// Test di connessione al server
app.get('/', (req, res) => {
  res.send('Server è attivo e funzionante!');
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});