# Node 18
FROM node:18

# Create app directory
WORKDIR /app

# Copy backend
COPY package*.json ./
RUN npm install
COPY . .

# Install pdftoppm for PDF -> JPG
RUN apt-get update && apt-get install -y poppler-utils

EXPOSE 3000
CMD ["node", "server.js"]
