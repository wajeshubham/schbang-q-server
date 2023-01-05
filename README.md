# Instructions to run

## Via `Docker`

```
docker-compose up --build
```

## Locally

- Make sure you have node and Mongodb installed in your machine

Update `.env` file with correct `DB_URL` as follows:

```.env
DB_URL=mongodb://localhost:27017/schbang-q-db
PORT=8000
```

```
npm install
```

```
npm run dev
```
