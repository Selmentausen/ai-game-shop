FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 50051
CMD ["npx", "tsx", "src/index.ts"]