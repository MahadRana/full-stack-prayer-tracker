FROM node:21.7.2

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development

RUN npm install

COPY . .

ENV PORT=4000

EXPOSE 4000

CMD ["npx", "nodemon", "server.js"]