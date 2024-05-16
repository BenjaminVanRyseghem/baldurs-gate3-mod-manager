import { verifyModSettings } from "@main/entities/modSettingsFile";
import { createBackupHandler, getBackupsHandler } from "@main/features/backup";
import { createBG3MMDir, createBackupDir } from "@main/shared/config";

const init = async () => {
  await verifyModSettings("BG3");

  createBackupDir();

  createBG3MMDir();

  const backupFiles = await getBackupsHandler("BG3");

  if (!backupFiles.length) {
    await createBackupHandler("BG3");
  }
};

export { init };
