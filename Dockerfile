FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl dos2unix
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY docker-entrypoint.sh /usr/local/bin/
RUN dos2unix /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh
RUN npx prisma generate
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npx", "tsx", "src/server.ts"]