FROM node:18-bullseye

RUN apt-get update && apt-get install -y poppler-utils && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
