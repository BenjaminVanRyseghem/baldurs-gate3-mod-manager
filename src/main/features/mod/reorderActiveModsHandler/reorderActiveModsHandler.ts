import { ModInfo, createModNode, createModNodeOrder } from "@main/entities/mod";
import {
  getCurrentSettings,
  saveModSettings,
} from "@main/entities/modSettingsFile";
import { GameKey } from "@main/shared/config";

const reorderActiveModsHandler = async (mods: ModInfo[], key: GameKey) => {
  const settings = await getCurrentSettings(key);
  const children = settings("#ModOrder children");

  children.empty();

  mods.forEach((mod) => {
    const node = createModNodeOrder(mod);

    children.append(node);
  });

  const modsList = settings("#Mods children");
  const gustavNode = settings("#Mods children node").first().clone();

  modsList.empty();

  modsList.append(gustavNode);

  mods.forEach((mod) => {
    const node = createModNode(mod);

    modsList.append(node);
  });

  await saveModSettings(settings.xml(), key);
};

export { reorderActiveModsHandler };
