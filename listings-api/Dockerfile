FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsoa spec-and-routes

EXPOSE 3000

CMD ["npx", "tsx", "index.ts"]