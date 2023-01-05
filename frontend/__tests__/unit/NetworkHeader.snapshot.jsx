import { render } from "@testing-library/react";
import NetworkHeader from "components/NetworkHeader";
import { testNetwork } from "./NetworkHeader.test";

it("renders HomeLoggedOut unchanged", () => {
  const { container } = render(<NetworkHeader network={testNetwork} />);
  expect(container).toMatchSnapshot();
});
