# Salair

**Salair** est une plateforme SaaS conçue pour accompagner les **freelances** et **autoentrepreneurs** dans la gestion complète de leur activité.  
Facturation, déclarations URSSAF, paiements en ligne, suivi client : tout est centralisé et automatisé.

## 🚀 Fonctionnalités principales

-   🧾 Création de factures personnalisables
-   💳 Paiements en ligne via Stripe
-   👤 Gestion de clients & relances automatiques
-   📊 Tableau de bord financier clair (CA, charges, solde)
-   📅 Déclarations URSSAF mensuelles ou trimestrielles
-   📁 Stockage sécurisé des documents (MinIO)


## 🛠 Stack technique

-   **Backend**: AdonisJS (Node.js)
-   **Frontend**: Nuxt 3 + TailwindCSS
-   **Base de données**: PostgreSQL
-   **Stockage fichiers**: MinIO (self-hosted S3)
-   **Paiement**: Stripe


## 📦 Installation (dev)

```bash
# Clone du repo
git clone https://github.com/ton-user/salair.git
cd salair

# Lancer le backend
cd backend
cp .env.example .env
npm install
node ace migration:run
npm run dev

# Lancer le frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

## 🧪 Tests

```bash
# Backend
cd backend
npm run test

# Frontend
cd ../frontend
npm run test
```

## 📚 Roadmap

-   [x] MVP Freelance : facturation + URSSAF + paiement
-   [ ] Intégration automatique des seuils/plafonds autoentrepreneur
-   [ ] Mode TPE (employeurs) avec paie simplifiée
-   [ ] Extension navigateur
-   [ ] Application mobile


## 🔒 Sécurité & conformité

-   Chiffrement AES des fichiers et données sensibles
-   Authentification sécurisée avec JWT
-   Conformité RGPD
-   Logs d'audit


## 🤝 Contribution

Les contributions sont les bienvenues !  
Crée une issue ou une pull request, et n'oublie pas de respecter le style de code défini dans le projet.

## 📄 Licence

Projet sous licence MIT.
