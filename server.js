const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();  // Définir 'app' ici pour Express
const adminRoutes = require('./routers/admin.routes');

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(express.json()); // important pour parser le JSON
// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/chatbot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connexion à MongoDB réussie');

  // Charger le modèle (ceci exécutera aussi l'insertion automatique)
  require('./model/admin.model');
})
.catch((err) => {
  console.error('❌ Erreur de connexion à MongoDB:', err);
});

// Définir le port du serveur
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});

// Autoriser les requêtes depuis Angular (dev)
app.use(cors({
    origin: 'http://localhost:4200',  // L'URL de ton application Angular
    methods: ['GET', 'POST'],
    credentials: true,
  }));

//login

app.use('/admin', adminRoutes);