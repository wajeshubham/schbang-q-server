# Instructions to run

Update `.env` file with correct `DB_URL` as follows:

```.env
PORT=8080
CORS_ORIGIN=http://localhost:3000
DB_URL=mongodb://mongodb:27017/db-sch
JWT_SECRET=123456789abcdefghijklmnopqrstuvwxyz
JWT_EXPIRY=<exp>
COOKIE_EXPIRY=<exp>
COOKIE_DOMAIN=<domain>

AWS_ACCESS_KEY=<XXXXXXXXXXXXXXXXX>
AWS_ACCESS_SECRET=<XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX>
AWS_BUCKET=<bkt-name>
```

## Via `Docker`

```
docker-compose up --build
```

## Locally

- Make sure you have node and Mongodb installed in your machine

```
npm install
```

```
npm run dev
```
