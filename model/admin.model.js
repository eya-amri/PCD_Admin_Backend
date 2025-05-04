const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // username is required
    },
    password: {
        type: String,
        required: true, // Password is required
    }
});


// Ajouter un admin statique juste après la création du modèle
const Admin = mongoose.model('admin', adminSchema);

// Fonction d'initialisation de l'admin
const initializeAdmin = async () => {
    try {
      // Vérifier si l'admin existe déjà
      const admin = await Admin.findOne({ username: 'admin' });
  
      if (!admin) {
        // Si l'admin n'existe pas, créer un nouvel admin avec mot de passe hashé
        const count = await Admin.countDocuments();
        if (count === 0) {
          const hashedPassword = await bcrypt.hash('admin', 10);
          await Admin.create({ username: 'admin', password: hashedPassword });
          console.log('Admin créé avec succès !');
        }
      } else {
        console.log("L'admin existe déjà !");
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'admin :', err);
    }
  };
  
  // Appeler la fonction d'initialisation de l'admin
  initializeAdmin();

module.exports = mongoose.model('admin', adminSchema);