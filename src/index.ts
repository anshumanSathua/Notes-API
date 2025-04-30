import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db";
import app from "./app";

const PORT = process.env.PORT;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
