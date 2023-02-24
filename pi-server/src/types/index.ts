export type CreateUserData = {
  id: number;
  firstName: string;
  lastName: string;
  backupMac?: string;
};

export type DBUser = CreateUserData & { id: number; createdAt: Date };

export type CreateCredentialData = {
  domain: string;
  name: string;
  username: string;
  password: string;
};

export type DBCredential = CreateCredentialData & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDeviceData = {
  name: string;
  mac: string;
};

export type DBDevice = CreateDeviceData & {
  id: number;
  createdAt: Date;
  lastUsedAt: Date;
};

export type CreateCredentialUsageData = {
  deviceId: number;
  credentialId: number;
  usedAt: Date;
};

export type DBCredentialUsage = CreateCredentialUsageData & {
  id: number;
};

export type InitialRegistrationData = {
  user: CreateUserData;
  device: CreateDeviceData;
};
