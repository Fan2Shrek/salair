# Soft Delete Implementation

Ce document décrit l'implémentation du soft delete (suppression douce) dans la plateforme Salair.

## Vue d'ensemble

Le soft delete a été implémenté pour les modèles critiques où la préservation des données historiques est importante. 
Au lieu de supprimer définitivement les données de la base de données, le soft delete marque les enregistrements comme supprimés en définissant une colonne `deleted_at` avec un timestamp.

## Architecture

Nous utilisons une classe de base abstraite `SoftDeletableModel` qui étend `BaseModel` d'AdonisJS. Cette classe fournit des méthodes communes pour gérer le soft delete :

1. `softDelete()` - Marque l'enregistrement comme supprimé (définit `deletedAt` à la date courante)
2. `restore()` - Restaure un enregistrement supprimé (définit `deletedAt` à null)
3. `isTrashed()` - Vérifie si un enregistrement est supprimé
4. `delete()` - Surcharge la méthode de suppression standard pour faire un soft delete
5. `forceDelete()` - Supprime définitivement l'enregistrement (hard delete)

## Modèles avec Soft Delete

Les modèles suivants utilisent le soft delete:

- `User` - Pour maintenir l'historique des utilisateurs et éviter la perte de données
- `Company` - Pour préserver les données d'entreprise à des fins financières/légales
- `BlogArticle` - Pour permettre la restauration du contenu et maintenir l'historique
- `Customer` - Pour préserver l'historique des relations client
- `Invoice` - Pour maintenir les documents financiers à des fins comptables et légales

## Schéma de base de données

Chaque table pour ces modèles inclut une colonne nullable `deleted_at` de type timestamp. Quand un enregistrement est "supprimé", 
cette colonne est définie à la date courante plutôt que de supprimer l'enregistrement de la base de données.

## Utilisation

### Opération standard

La méthode régulière `delete()` sur ces modèles effectue maintenant un soft delete automatiquement:

```typescript
// Ceci fera un soft delete de l'utilisateur
const user = await User.findOrFail(id);
await user.delete();
```

### Comment travailler avec les enregistrements soft-deleted

Un service utilitaire (`SoftDeleteService`) est disponible avec des méthodes pour:

1. Forcer la suppression d'enregistrements (suppression permanente)
2. Restaurer les enregistrements soft-deleted
3. Trouver les enregistrements soft-deleted

Exemple:

```typescript
import softDeleteService from '#services/soft_delete_service'

// Restaurer un enregistrement soft-deleted
const user = await User.query().whereNotNull('deleted_at').where('id', id).first();
await softDeleteService.restore(user);

// Supprimer définitivement un enregistrement
await softDeleteService.forceDelete(user);

// Trouver les enregistrements soft-deleted
const deletedUsers = await softDeleteService.findSoftDeleted(User);
```

### Requêtes

Par défaut, les enregistrements soft-deleted sont exclus des résultats de requête. Pour les inclure, utilisez des scopes spécifiques:

```typescript
// Inclure les enregistrements soft-deleted dans la requête
const allUsers = await User.query().whereNull('deleted_at').orWhereNotNull('deleted_at').exec();

// Trouver uniquement les enregistrements soft-deleted
const onlyTrashedUsers = await User.query().whereNotNull('deleted_at').exec();
```

## Migration

S'assurer que chaque table qui utilise le soft delete a une colonne `deleted_at` timestamp nullable:

```typescript
table.timestamp('deleted_at').nullable()
```

## Extension

Pour ajouter le soft delete à un nouveau modèle:

1. Faire hériter le modèle de `SoftDeletableModel` au lieu de `BaseModel`
2. S'assurer que la table correspondante a une colonne `deleted_at`
3. Ajouter les scopes appropriés si des besoins personnalisés sont nécessaires
