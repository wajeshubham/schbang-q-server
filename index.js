import app from "./app.js";
import databaseConnection from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

databaseConnection();

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
