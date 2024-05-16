import { ExportOrderButtonProps } from "../ExportOrderButton.type";

const ExportOrderButtonMock = (props: ExportOrderButtonProps) => (
  <div data-testid="ExportOrderButton">{JSON.stringify(props)}</div>
);

export { ExportOrderButtonMock };
