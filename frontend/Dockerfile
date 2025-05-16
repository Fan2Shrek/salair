# Utiliser une version légère et sécurisée de Node.js
ARG NODE_VERSION=22.14.0

# Étape 1 : Développement
FROM node:${NODE_VERSION}-alpine AS dev

WORKDIR /app

# Copie uniquement les fichiers nécessaires pour l'installation
COPY package.json package-lock.json ./

# Installation rapide des dépendances (utile pour dev)
RUN npm install

# Copie du reste de l'application
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Étape 2 : Build
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY . .

# Installation stricte (fiable pour CI/CD)
RUN npm ci

# Build Nuxt avec sortie dans .output/
RUN npm run build

# Étape 3 : Production
FROM node:${NODE_VERSION}-alpine AS prod

WORKDIR /app

# Copie uniquement ce qui est nécessaire à l'exécution

COPY --from=builder /app/.output .output

# Port exposé (par défaut pour Nuxt)
EXPOSE 3000

# Lancement du serveur Nuxt
CMD ["node", ".output/server/index.mjs"]
