import { saveSettings } from "@main/shared/config";
import { getGameSettings } from "@main/shared/lib/helpers";

import { GameSettingsUpdateDto } from "./updateGameSettingsHandler.type";

const updateGameSettingsHandler = async ({
  gameKey,
  backupDirectory,
  bg3mmDirectory,
  modsDirectory,
  modSettingsFile,
}: GameSettingsUpdateDto) => {
  const gameSettings = getGameSettings(gameKey);

  gameSettings.MODS_DIRECTORY = modsDirectory;

  gameSettings.MOD_SETTINGS_PATH = modSettingsFile;

  gameSettings.BACKUP_DIR = backupDirectory;

  gameSettings.BG3MM_DIR = bg3mmDirectory;

  await saveSettings();
};

export { updateGameSettingsHandler };
