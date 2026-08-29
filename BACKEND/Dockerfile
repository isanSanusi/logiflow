FROM node:20-alpine

WORKDIR /app

# Install all deps (prisma CLI is usually a devDependency, needed for generate)
COPY package*.json ./
RUN npm ci

# Copy prisma schema before generate
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of the source
COPY . .

# Optional: prune devDependencies after generate to slim the image
RUN npm prune --omit=dev

USER node

EXPOSE 3000
CMD ["node", "server.js"]