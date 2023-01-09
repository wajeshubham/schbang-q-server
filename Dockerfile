FROM --platform=linux/amd64 node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm ci --only=production

COPY . .

EXPOSE 80

# CMD [ "npm", "run", "dev"]
CMD [ "npm", "start"]
