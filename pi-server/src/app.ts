import express from "express";
import cors from "cors";
import { AuthController } from "./controller/auth.controller";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => AuthController.register(req, res));

app.post("/login", (req, res) => AuthController.login(req, res));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
