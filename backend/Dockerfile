# ===== BUILD STAGE =====
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# ===== RUNTIME =====
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 5000
CMD ["node", "server.js"]
