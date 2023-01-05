import { connect } from "mongoose";

const databaseConnection = () =>
  connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(`DB connection error: ${err}`);
      process.exit(1);
    });

export default databaseConnection;
