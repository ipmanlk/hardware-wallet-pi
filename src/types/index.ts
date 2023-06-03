export type CreateUserData = {
  firstName: string;
  lastName: string;
  backupMac: string | null;
};

export type DBUser = CreateUserData & { id: number; createdAt: Date };

export type CredentialData = {
  domain: string;
  name: string;
  username: string;
  password: string;
};

export type CreateCredentialData = CredentialData & {
  createdAt?: string;
  updatedAt?: string;
};

export type DBCredential = CreateCredentialData & {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: string;
};

export type CreateDeviceData = {
  name: string;
  mac: string;
};

export type DBDevice = CreateDeviceData & {
  id: number;
  createdAt: string;
  lastUsedAt: string;
};

export type CreateCredentialUsageData = {
  deviceId: number;
  credentialId: number;
  usedAt: string;
};

export type DBCredentialUsage = CreateCredentialUsageData & {
  id: number;
};

export type InitialRegistrationData = {
  user: CreateUserData;
  device: CreateDeviceData;
};

export type CreateDeviceMacData = {
  mac: string;
  trusted: number;
}

export type DbTrustedDeviceData = CreateDeviceMacData & {
  id: number;
  createdAt: string;
}