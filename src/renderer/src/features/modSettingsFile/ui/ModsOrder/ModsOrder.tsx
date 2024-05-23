import { useEffect, useId, useRef } from "react";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  DropResult,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";

import { classNames, trpc } from "@renderer/shared/lib/helpers";
import { Heading } from "@renderer/shared/ui";

import { EmptyList } from "../EmptyList";
import { InstalledMod } from "../InstalledMod";

import css from "./ModsOrder.module.scss";
import { ModsOrderProps } from "./ModsOrder.type";
// TODO check
const ModsOrder = ({
  className,
  mods = [],
  game,
  selectedMod,
}: ModsOrderProps) => {
  const scrollNode = useRef<HTMLDivElement>(null);
  const utils = trpc.useContext();
  const scrollId = useId();

  useEffect(() => {
    if (!selectedMod || !scrollNode.current) {
      return;
    }

    const matchingNode = scrollNode.current.querySelector(
      `[data-uuid="${selectedMod.uuid}"]`,
    );

    const scrollableList = scrollNode.current.querySelector(
      `[data-id="${scrollId}"]`,
    );

    if (!matchingNode || !scrollableList) return;

    const top =
      matchingNode.getBoundingClientRect().top + scrollableList.scrollTop - 47;

    scrollableList.scrollTo({ top, behavior: "smooth" });
  }, [selectedMod, scrollNode]);

  const { mutate } = trpc.mod.reorderActiveMods.useMutation({
    onSuccess: () => utils.mod.getInstalledMods.invalidate(),

    // When mutate is called:
    onMutate: async (values) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.mod.getInstalledMods.cancel();

      // Snapshot the previous value
      const previousData = utils.mod.getInstalledMods.getData();

      // Optimistically update to the new value
      utils.mod.getInstalledMods.setData(game, (oldData) => {
        const installedMods = oldData?.installedMods ?? [];
        const activeMods = oldData?.activeMods ?? [];

        const newActiveMods = values.mods
          .map((value) => activeMods.find(({ uuid }) => uuid === value.uuid))
          .filter(Boolean);

        return { installedMods, activeMods: newActiveMods };
      });

      // Return a context object with the snapshotted value
      return { previousData };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_, __, context) => {
      utils.mod.getInstalledMods.setData(game, context?.previousData);
    },
    // Always refetch after error or success:
    onSettled: () => {
      utils.mod.getInstalledMods.invalidate();
    },
  });

  const getItemStyle = (
    draggableStyle?: DraggingStyle | NotDraggingStyle | undefined,
  ) => ({
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const reorder = (
    list: ModsOrderProps["mods"],
    startIndex: number,
    endIndex: number,
  ) => {
    if (!list) {
      return;
    }

    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragDropContextDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(mods, result.source.index, result.destination.index);

    if (!items) {
      return;
    }

    mutate({ mods: items, gameKey: game });
  };

  return (
    <div
      ref={scrollNode}
      className={classNames(css.ModsOrder, className)}
      data-testid="ModsOrder"
    >
      <Heading className={css.Title} variant="h3">
        Mod Order
      </Heading>
      {mods?.length ? (
        <DragDropContext onDragEnd={onDragDropContextDragEnd}>
          <Droppable droppableId="modOrderDroppable">
            {(provided, { isDraggingOver }) => (
              <div
                {...provided.droppableProps}
                data-id={scrollId}
                ref={provided.innerRef}
                className={classNames(
                  css.droppable,
                  isDraggingOver && css.isOver,
                )}
              >
                {mods.map((mod, index) => (
                  <Draggable
                    key={mod.uuid}
                    draggableId={mod.uuid!}
                    index={index}
                  >
                    {({ draggableProps, dragHandleProps, innerRef }) => (
                      <div
                        data-uuid={mod.uuid!}
                        className={css.modWrapper}
                        ref={innerRef}
                        {...draggableProps}
                        {...dragHandleProps}
                        style={getItemStyle(draggableProps.style)}
                      >
                        <InstalledMod
                          className={css.installedMod}
                          game={game}
                          mod={mod}
                          position={index}
                          onClick={undefined}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <EmptyList>
          <Heading variant="h4">
            Activate the mods from the Installed Mods list below using Activate
            button and they will appear here
          </Heading>
        </EmptyList>
      )}
    </div>
  );
};

export { ModsOrder };
