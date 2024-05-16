import { GameKey } from "@main/shared/config";

export type GameSettingsUpdateDto = {
  modSettingsFile: string;
  modsDirectory: string;
  backupDirectory: string;
  bg3mmDirectory: string;
  gameKey: GameKey;
};
