import express from "express";
import "express-async-errors";

import { routes } from "./routes/api/v1";
import { errorHandling } from "./middlewares/error-handling";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

app.use(errorHandling);

export { app };
function cors(): any {
  throw new Error("Function not implemented.");
}
