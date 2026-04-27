FROM node:22-slim
WORKDIR /app

# Copy package files and install all dependencies once
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Set CI to false to prevent build errors on warnings
ENV CI=false

# Build the Vite frontend
RUN npm run build

# Expose the port and start the server
EXPOSE 8080
CMD ["npm", "start"]
