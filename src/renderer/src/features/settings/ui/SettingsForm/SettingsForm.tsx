import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { delay } from "@common/lib";
import Visibility from "@renderer/shared/assets/icons/visibility.svg";
import { classNames, trpc } from "@renderer/shared/lib/helpers";
import { Button, IconButton, TextField } from "@renderer/shared/ui";

import css from "./SettingsForm.module.scss";
import { SettingsFormProps, SettingsFormValues } from "./SettingsForm.type";

const SettingsForm = ({ className, game }: SettingsFormProps) => {
  const utils = trpc.useUtils();
  const { data } = trpc.settings.getGameSettings.useQuery(game);

  const { mutateAsync } = trpc.settings.updateGameSettings.useMutation({
    onSettled: async () => {
      await utils.invalidate();
    },
  });

  const { register, handleSubmit, formState, getValues } =
    useForm<SettingsFormValues>({
      defaultValues: {
        modSettingsFile: data?.MOD_SETTINGS_PATH,
        modsDirectory: data?.MODS_DIRECTORY,
        backupDirectory: data?.BACKUP_DIR,
        bg3mmDirectory: data?.BG3MM_DIR,
      },
      mode: "onTouched",
    });

  const onSubmit = async (values: SettingsFormValues) => {
    await Promise.all([delay(850), mutateAsync({ ...values, gameKey: game })]);
  };

  useEffect(() => {}, []);

  return (
    <form
      className={classNames(css.SettingsForm, className)}
      data-testid="SettingsForm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register("modSettingsFile")}
        label="Path to modsettings.lsx"
      />
      <TextField
        {...register("modsDirectory")}
        label="Path to Mods directory"
      />
      <div className={css.TextAndButton}>
        <TextField
          {...register("backupDirectory")}
          label="Path to Backup directory"
          button={
            <IconButton
              className={css.open}
              onClick={() => {
                window.electron.openPath(getValues("backupDirectory"));
              }}
              title="Copy content to buffer"
            >
              <Visibility />
            </IconButton>
          }
        />
      </div>
      <TextField
        {...register("bg3mmDirectory")}
        label="Path to BG3MM order directory"
        button={
          <IconButton
            className={css.open}
            onClick={() => {
              window.electron.openPath(getValues("bg3mmDirectory"));
            }}
            title="Copy content to buffer"
          >
            <Visibility />
          </IconButton>
        }
      />
      <Button
        className={css.submitButton}
        color="success"
        disabled={formState.isSubmitting}
        loading={formState.isSubmitting}
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export { SettingsForm };
