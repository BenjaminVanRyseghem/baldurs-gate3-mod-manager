import { useState } from "react";

import { InstalledMod } from "@renderer/features/modSettingsFile/ui/InstalledMod";
import { ModsOrder } from "@renderer/features/modSettingsFile/ui/ModsOrder";
import { classNames, trpc } from "@renderer/shared/lib/helpers";
import { Heading, StickyBlock } from "@renderer/shared/ui";

import { EmptyList } from "../EmptyList";

import css from "./InstalledModsList.module.scss";
import { InstalledModsListProps } from "./InstalledModsList.type";

const InstalledModsList = ({ className, game }: InstalledModsListProps) => {
  const { data } = trpc.mod.getInstalledMods.useQuery(game);
  const [selectedMod, setSelectedMod] = useState(null);

  return (
    <div
      className={classNames(css.InstalledModsList, className)}
      data-testid="InstalledModsList"
    >
      <ModsOrder
        game={game}
        mods={data?.activeMods}
        selectedMod={selectedMod}
      />
      <div className={css.InstalledMods}>
        <StickyBlock>
          <Heading variant="h3">Installed Mods</Heading>
        </StickyBlock>
        {data?.installedMods.length ? (
          data?.installedMods
            .sort((one, another) => {
              const oneName = one.name || one.fileName || "";
              const anotherName = another.name || another.fileName || "";

              if (!one.isActive && another.isActive) return -1;

              if (one.isActive && !another.isActive) return 1;

              return oneName.localeCompare(anotherName);
            })
            .map((mod, index) => {
              const position = data?.activeMods?.findIndex(
                (each) => each.uuid === mod.uuid,
              );

              return (
                <InstalledMod
                  key={mod.uuid ?? (mod.name || index)}
                  game={game}
                  mod={mod}
                  position={position ? position + 1 : undefined}
                  onClick={() => setSelectedMod(mod)}
                />
              );
            })
        ) : (
          <EmptyList>
            <Heading variant="h4">
              You haven't installed any mods yet. Use the panel on the right to
              install mods
            </Heading>
          </EmptyList>
        )}
      </div>
    </div>
  );
};

export { InstalledModsList };
