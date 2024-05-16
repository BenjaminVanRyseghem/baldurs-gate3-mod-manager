import { delay } from "@common/lib";
import { classNames, trpc } from "@renderer/shared/lib/helpers";
import { Button } from "@renderer/shared/ui";

import css from "./ExportOrderButton.module.scss";
import { ExportOrderButtonProps } from "./ExportOrderButton.type";

const ExportOrderButton = ({ className, game }: ExportOrderButtonProps) => {
  const utils = trpc.useUtils();

  const { mutate, isLoading } = trpc.backup.exportBG3MMOrder.useMutation({
    onMutate: async (variables) => {
      await delay(850);

      return variables;
    },
    onSettled: () => {
      utils.backup.invalidate();
    },
  });

  return (
    <Button
      className={classNames(css.ExportOrderButton, className)}
      data-testid="ExportOrderButton"
      onClick={() => mutate(game)}
      loading={isLoading}
      disabled={isLoading}
    >
      Export Order to BG3MM format
    </Button>
  );
};

export { ExportOrderButton };
