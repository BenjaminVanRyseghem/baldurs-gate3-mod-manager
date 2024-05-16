import { readdir } from "fs/promises";
import { resolve } from "path";

import { getModInfoFromFile } from "@main/entities/mod";
import { getCurrentSettings } from "@main/entities/modSettingsFile";
import { GameKey } from "@main/shared/config";
import { getGameSettings } from "@main/shared/lib/helpers";
import { isPak } from "@main/shared/lib/helpers/fileExtension";

import { InstalledMod } from "./getInstalledModsHandler.type";

async function batchPromises(
  promises: (() => Promise<InstalledMod>)[],
  batchSize: number = 100,
): Promise<InstalledMod[]> {
  let slice = promises.splice(0, Math.min(promises.length, batchSize));

  const result = [];

  while (slice.length > 0) {
    const partialResult = await Promise.all(
      slice.map((promiseFn) => promiseFn()),
    );

    result.push(...partialResult);

    slice = promises.splice(0, Math.min(promises.length, batchSize));
  }

  return result;
}

const getInstalledModsHandler = async (key: GameKey) => {
  const { MODS_DIRECTORY } = getGameSettings(key);
  const settings = await getCurrentSettings(key);
  const activeNodeUUID = new Set<string>();

  settings("#ModOrder children node").each((_, element) => {
    const node = settings(element);

    node.children().each((__, child) => {
      const attribute = settings(child);
      const value = attribute.attr("value");

      if (value) {
        activeNodeUUID.add(value);
      }
    });
  });

  const files = await readdir(MODS_DIRECTORY);
  const allModsMap = new Map<string, InstalledMod>();

  const allModsList = await batchPromises(
    files.filter(isPak).map((file) => async () => {
      const filePath = resolve(MODS_DIRECTORY, file);
      const modInfo = await getModInfoFromFile(filePath);
      const mod = modInfo as InstalledMod;

      if (!mod.uuid || !activeNodeUUID.has(mod.uuid)) {
        mod.isActive = false;
      } else {
        mod.isActive = true;
      }

      if (mod.uuid) {
        allModsMap.set(mod.uuid, mod);
      }

      return mod;
    }),
  );

  const activeMods: InstalledMod[] = [];

  for (const activeUUID of activeNodeUUID) {
    const mod = allModsMap.get(activeUUID);

    if (mod) {
      activeMods.push(mod);
    }
  }

  const installedMods = allModsList.filter(
    ({ name }) => !name?.includes("Gustav"),
  );

  return { installedMods, activeMods };
};

export { getInstalledModsHandler };
