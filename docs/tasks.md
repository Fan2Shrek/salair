# Salair - Liste des tâches d'amélioration

Ce document contient une liste complète des tâches que tu peux réaliser pour améliorer ta plateforme Salair. Chaque tâche est marquée avec une case à cocher [ ] que tu peux cocher une fois terminée.

## 🚀 FONCTIONNALITÉS MANQUANTES (Priorité élevée)

### Système de facturation complet
- [ ] Implémenter le contrôleur `InvoicesController` avec tous les endpoints CRUD
- [ ] Créer le validateur `invoice.ts` pour la validation des données
- [ ] Développer le formulaire de création de facture frontend (`/app/invoices/create.vue`)
- [ ] Implémenter la gestion des statuts de facture (brouillon → envoyée → payée → en retard)
- [ ] Créer le système de numérotation automatique des factures
- [ ] Ajouter la fonctionnalité d'envoi de facture par email
- [ ] Implémenter la prévisualisation et l'export PDF des factures

### Gestion des clients
- [ ] Compléter les opérations CRUD pour les clients (création, modification)
- [ ] Créer le validateur `customer.ts` pour la validation des données client
- [ ] Améliorer le modal de création de client avec validation SIREN complète
- [ ] Ajouter la page de détails client avec historique des factures
- [ ] Implémenter les vraies statistiques clients (remplacer les valeurs hardcodées)
- [ ] Créer l'interface de recherche et filtrage des clients

### Système de paiement
- [ ] Intégrer le traitement des paiements avec Stripe
- [ ] Créer les API d'enregistrement des paiements (`PaymentsController`)
- [ ] Implémenter l'interface de suivi des paiements
- [ ] Ajouter la réconciliation automatique des paiements
- [ ] Créer les rapports de paiements et impayés

### Gestion des articles de facture
- [ ] Implémenter la gestion des lignes de facture (InvoiceItem)
- [ ] Créer l'interface d'ajout/suppression d'articles dans les factures
- [ ] Ajouter le calcul automatique des totaux et taxes
- [ ] Implémenter la gestion des taux de TVA

## 🔧 AMÉLIORATIONS BACKEND

### Contrôleurs et API
- [ ] Créer le contrôleur complet pour les factures avec tous les endpoints
- [ ] Implémenter les endpoints de gestion des articles de facture
- [ ] Compléter la gestion des profils d'entreprise (`CompaniesController`)
- [ ] Créer les API de rapports financiers et statistiques
- [ ] Implémenter les endpoints de recherche et filtrage

### Validation et sécurité
- [ ] Créer les validateurs pour factures, clients, paiements
- [ ] Implémenter l'autorisation au niveau des ressources (ownership checks)
- [ ] Ajouter la limitation de taux (rate limiting) sur les endpoints critiques
- [ ] Améliorer la gestion d'erreurs standardisée
- [ ] Implémenter la validation des données d'entreprise (SIREN/SIRET)

### Services métier
- [ ] Extraire la logique métier des contrôleurs vers des services
- [ ] Créer `InvoiceService` pour la gestion des factures
- [ ] Créer `PaymentService` pour la gestion des paiements
- [ ] Créer `CustomerService` pour la gestion des clients
- [ ] Implémenter la logique de transitions d'état des factures
- [ ] Ajouter les calculs de taxes et totaux automatiques

### Base de données
- [ ] Ajouter les indexes manquants pour optimiser les performances
- [ ] Implémenter la pagination cohérente sur tous les endpoints
- [ ] Optimiser les requêtes avec eager loading
- [ ] Créer les migrations pour les nouvelles fonctionnalités
- [ ] Implémenter l'audit trail pour les opérations critiques

## 💻 AMÉLIORATIONS FRONTEND

### Interfaces utilisateur manquantes
- [ ] Compléter la page de création de facture (`/app/invoices/create.vue`)
- [ ] Améliorer la liste des factures avec filtres et recherche
- [ ] Créer l'interface d'enregistrement des paiements
- [ ] Développer le tableau de bord avec vraies métriques
- [ ] Créer la page de détails de facture
- [ ] Implémenter l'interface de gestion des paramètres d'entreprise

### Expérience utilisateur
- [ ] Implémenter les états de chargement cohérents (skeleton screens)
- [ ] Améliorer la validation des formulaires avec messages d'erreur
- [ ] Optimiser la responsivité mobile pour toutes les pages
- [ ] Ajouter des animations et transitions fluides
- [ ] Implémenter les notifications toast pour les actions utilisateur
- [ ] Créer un système de navigation plus intuitif

### Composables et services
- [ ] Créer `useInvoices.ts` pour la gestion des factures
- [ ] Améliorer `useCustomers.ts` avec toutes les opérations CRUD
- [ ] Créer `usePayments.ts` pour la gestion des paiements
- [ ] Implémenter `useReports.ts` pour les rapports et statistiques
- [ ] Optimiser `useAuthFetch.ts` avec gestion d'erreurs améliorée

## 🧪 TESTS ET QUALITÉ

### Couverture de tests backend
- [ ] Implémenter les tests unitaires pour tous les contrôleurs
- [ ] Créer les tests pour tous les services métier
- [ ] Ajouter les tests d'intégration pour les API
- [ ] Implémenter les tests de validation des données
- [ ] Créer les tests de sécurité et d'autorisation

### Tests frontend
- [ ] Créer les tests de composants Vue avec Vue Test Utils
- [ ] Implémenter les tests des composables
- [ ] Ajouter les tests d'intégration des pages
- [ ] Créer les tests end-to-end avec Playwright/Cypress
- [ ] Tester les formulaires et la validation côté client

### Qualité du code
- [ ] Améliorer la sécurité des types TypeScript
- [ ] Standardiser la gestion d'erreurs dans toute l'application
- [ ] Refactoriser pour une meilleure séparation des responsabilités
- [ ] Améliorer la documentation du code (JSDoc/TSDoc)
- [ ] Implémenter les patterns de design appropriés

## 📊 FONCTIONNALITÉS AVANCÉES

### Rapports et analytiques
- [ ] Créer le dashboard financier avec graphiques
- [ ] Implémenter les rapports de revenus par période
- [ ] Ajouter les graphiques de performance client
- [ ] Créer l'export des données comptables (CSV, PDF)
- [ ] Implémenter les prévisions de revenus
- [ ] Ajouter les indicateurs de performance clés (KPI)

### Automatisation
- [ ] Implémenter les relances automatiques de paiement
- [ ] Créer le système de notifications par email
- [ ] Ajouter les rappels de paiement automatiques
- [ ] Implémenter la synchronisation bancaire
- [ ] Créer les workflows d'approbation pour les factures
- [ ] Ajouter la génération automatique de rapports

### Intégrations
- [ ] Intégrer avec les services bancaires pour import des transactions
- [ ] Créer l'intégration avec les services comptables
- [ ] Implémenter l'export vers les logiciels comptables
- [ ] Ajouter l'intégration avec les plateformes de paiement
- [ ] Créer les webhooks pour les intégrations tierces

## 🔍 RECOMMANDATIONS PAR PHASE

### Phase 1 : Fonctionnalités de base (4-6 semaines)
1. **Contrôleur de factures** avec API complète
2. **Formulaire de création de facture** frontend
3. **Gestion CRUD des clients** complète
4. **Système de validation** complet
5. **Tests unitaires** pour les nouvelles fonctionnalités

### Phase 2 : Fonctionnalités métier (4-6 semaines)
6. **Intégration des paiements** avec Stripe
7. **Gestion des statuts de facture** et workflows
8. **Calculs automatiques** (taxes, totaux, numérotation)
9. **Vraies statistiques clients** et rapports de base
10. **Interface de gestion des paiements**

### Phase 3 : Qualité et tests (3-4 semaines)
11. **Suite de tests complète** (backend + frontend)
12. **Amélioration de la sécurité** et autorisation
13. **Optimisation des performances** et base de données
14. **Documentation API** et code

### Phase 4 : Fonctionnalités avancées (6-8 semaines)
15. **Dashboard et rapports** avancés
16. **Automatisation des processus** (relances, notifications)
17. **Intégrations externes** (banques, comptabilité)
18. **Fonctionnalités d'export** et de synchronisation

## 📋 TÂCHES TECHNIQUES SPÉCIFIQUES

### Immédiatement réalisables
- [ ] Remplacer les valeurs hardcodées dans `customers.controller.ts:63-70`
- [ ] Implémenter la page vide `/app/invoices/create.vue`
- [ ] Créer le fichier manquant `/backend/app/validators/invoice.ts`
- [ ] Compléter le modal de création de client avec validation
- [ ] Ajouter la gestion d'erreurs dans `fetchCompany` method

### À moyen terme
- [ ] Refactoriser la logique métier des contrôleurs vers des services
- [ ] Implémenter la pagination cohérente sur tous les endpoints
- [ ] Créer les tests manquants pour les fonctionnalités existantes
- [ ] Optimiser les requêtes de base de données avec des indexes
- [ ] Améliorer la gestion des erreurs frontend avec des messages utilisateur

---

**💡 Conseil** : Commence par les tâches de la Phase 1 pour avoir une base fonctionnelle solide, puis progresse vers les phases suivantes selon tes priorités business.

**🎯 Objectif** : Chaque tâche cochée te rapproche d'une plateforme Salair pleinement fonctionnelle et prête pour la production !