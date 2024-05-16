import { render } from "@testing-library/react";

import { withQueryProvider } from "@renderer/shared/lib/helpers/testUtils";

import { ExportOrderButton } from "./ExportOrderButton";

describe("<SaveSettingsButton />", () => {
  const game = "BG3";
  const Component = <ExportOrderButton game={game} />;

  it("should be defined", () => {
    expect(ExportOrderButton).toBeDefined();
  });

  it("should match the snapshot", () => {
    const { container } = render(withQueryProvider(Component));

    expect(container).toMatchSnapshot();
  });

  it("should contain a data test id", () => {
    const { getByTestId } = render(withQueryProvider(Component));
    const element = getByTestId("SaveSettingsButton");

    expect(element).toBeDefined();
  });
});
