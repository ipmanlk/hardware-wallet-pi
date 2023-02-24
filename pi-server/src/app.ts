import express from "express";
import cors from "cors";
import { AuthController } from "./controller/auth.controller";
import { DatabaseService } from "./service/DatabaseService";
import { CredentialsController } from "./controller/credentials.controller";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Device is online");
});

app.get("/device-status", (req, res) =>
  AuthController.getDeviceStatus(req, res)
);

app.post("/register", (req, res) => AuthController.register(req, res));

app.post("/login", (req, res) => AuthController.login(req, res));

app.post("/credentials", (req, res) =>
  CredentialsController.createCredential(req, res)
);

app.get("/credentials", (req, res) =>
  CredentialsController.getCredentialByDomain(req, res)
);

DatabaseService.initializeDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
});
