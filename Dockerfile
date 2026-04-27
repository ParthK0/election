FROM node:22-slim
WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copy the pre-built 'dist' folder and the server
COPY dist ./dist
COPY server.js ./

EXPOSE 8080
CMD ["node", "server.js"]
