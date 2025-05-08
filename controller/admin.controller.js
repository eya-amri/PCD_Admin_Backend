const bcrypt = require('bcrypt');
const Admin = require('../model/admin.model'); // Adapte le chemin si besoin
const Joi = require('joi');

// Schéma Joi de validation pour la connexion de l'admin
const loginAdminValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const loginAdmin = async (req, res) => {
  try {
    console.log('Données reçues:', req.body); // Affiche les données envoyées pour la connexion

    // 1. Validation des données d'entrée avec Joi
    const { error } = loginAdminValidation.validate(req.body);
    if (error) {
      console.log('Erreur de validation:', error.details);
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
      });
    }else{
        console.log('Données reçues:', req.body);
    }

    const { username, password } = req.body;

    // 2. Vérifier si l'admin existe dans la base de données
    console.log("Recherche de l'admin dans la base de données...");
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log("Admin non trouvé");
      return res.status(401).json({
        status: 'error',
        message: 'Nom d’utilisateur incorrect',
      });
    }

    // 3. Comparer le mot de passe fourni avec celui stocké dans la base de données
    console.log('Vérification du mot de passe...');
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Mot de passe incorrect");
      return res.status(401).json({
        status: 'error',
        message: 'Mot de passe incorrect',
      });
    }else{
      console.log('Authentification réussie');
    }

    // 4. Authentification réussie, on crée une session pour l'admin
    console.log('Authentification réussie');
    req.session.admin = {
      id: admin._id,
      username: admin.username,
    };

    // 5. Répondre avec succès
    return res.status(200).json({
      status: 'success',
      message: 'Authentification réussie'
    });
  } catch (err) {
    console.error('Erreur lors de la connexion de l\'admin:', err);
    // Gérer les erreurs serveur
    res.status(500).json({
      status: 'error',
      message: 'Erreur interne du serveur',
    });
  }
};

module.exports = { loginAdmin };
