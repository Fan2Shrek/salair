#!/bin/sh

# Exécution des migrations
echo "Running database migrations..."
node ace migration:run

# Démarrage de l'application
echo "Starting application..."
npm run dev