# Build Stage
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENV CI=false
RUN npm run build

# Production Stage
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --production
COPY --from=build /app/dist ./dist
COPY server.js ./
EXPOSE 8080
CMD ["node", "server.js"]
