import express from "express";
import cors from "cors";
import { AuthController } from "./controller/auth.controller";
import { DatabaseService } from "./service/DatabaseService";
import { CredentialsController } from "./controller/credentials.controller";
import https from "https";
import fs from "fs";
import { CERT_DIR } from "./constants";
import { DeviceController } from "./controller/device.controller";

const PORT = 3000;
const privateKey = fs.readFileSync(`${CERT_DIR}/key.pem`, "utf8");
const certificate = fs.readFileSync(`${CERT_DIR}/cert.pem`, "utf8");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const server = https.createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app
);

app.get("/", (req, res) => {
  res.send("Device is online");
});

app.post("/register", (req, res) => AuthController.register(req, res));

app.post("/login", (req, res) => AuthController.login(req, res));

app.post("/credentials", (req, res) =>
  CredentialsController.createCredential(req, res)
);

app.get("/credentials", (req, res) =>
  CredentialsController.getCredentials(req, res)
);

app.get("/credential-by-domain", (req, res) =>
  CredentialsController.getCredentialByDomain(req, res)
);

app.delete("/credentials/:id", (req, res) =>
  CredentialsController.deleteCredential(req, res)
);

app.patch("/credentials/:id", (req, res) =>
  CredentialsController.patchCredential(req, res)
);

app.get("/credentials/:id", (req, res) =>
  CredentialsController.getCredentialById(req, res)
);

app.get("/device/status", (req, res) =>
  DeviceController.getDeviceStatus(req, res)
);

app.get("/device/backup", (req, res) => DeviceController.getBackup(req, res));

app.post("/device/restore", (req, res) =>
  DeviceController.restoreBackup(req, res)
);

app.delete("/device/reset", (req, res) => {
  DeviceController.resetDevice(req, res);
});

DatabaseService.initializeDb().then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
});
