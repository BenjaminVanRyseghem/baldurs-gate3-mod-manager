import { writeFile } from "fs/promises";
import path from "path";

import dayjs from "dayjs";

import { getCurrentSettings } from "@main/entities/modSettingsFile";
import { GameKey } from "@main/shared/config";
import { getGameSettings } from "@main/shared/lib/helpers";

const exportBG3MMOrderHandler = async (gameKey: GameKey) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { BG3MM_DIR } = getGameSettings(gameKey);
  const settings = await getCurrentSettings(gameKey);
  const modList = settings("#Mods children node");
  const mods: object[] = [];

  modList.each((_, mod) => {
    let uuid;
    let name;

    for (const child of mod.children) {
      if (child.type === "text" || !child.attribs) continue;

      if (child.attribs.id === "UUID") {
        uuid = child.attribs.value;
      }

      if (child.attribs.id === "Name") {
        name = child.attribs.value;

        if (name === "Gustav" || name === "GustavDev") return;
      }
    }

    mods.push({
      UUID: uuid,
      Name: name,
    });
  });

  const bg3Order = {
    Order: mods,
  };

  const filePath = path.resolve(
    BG3MM_DIR,
    `BG3MMOrder-${dayjs().format("YYYY-MM-DD_HH-mm-ss")}.json`,
  );

  await writeFile(filePath, JSON.stringify(bg3Order, null, 2));
};

export { exportBG3MMOrderHandler };
