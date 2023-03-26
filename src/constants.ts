import { resolve } from "path";

export const DB_PATH = resolve(`${__dirname}/../data/data.db`);
export const CERT_DIR = resolve(`${__dirname}/../certs`);
export const ORIGINAL_FP_PATH = "/tmp/fingerprint.bmp";
export const FP_PATH = resolve(`${__dirname}/../data/data.bmp`);
export const WALLET_BACKUP_KEY_PATH = resolve(
  `${__dirname}/../data/backup.key`
);

export const PYTHON_LIB_PATH = "/usr/share/doc/python3-fingerprint/examples";
export const REGISTER_SCRIPT = `${PYTHON_LIB_PATH}/example_enroll.py`;
export const DOWNLOAD_SCRIPT = `${PYTHON_LIB_PATH}/example_downloadimage.py`;
export const DELETE_SCRIPT = `${PYTHON_LIB_PATH}/example_delete_all.py`;
export const SCAN_SCRIPT = `${PYTHON_LIB_PATH}/example_search.py`;
export const REGISTER_SUCCESS_MSG = "enrolled successfully";
export const SCAN_SUCCESS_MSG = "Found template at position";
