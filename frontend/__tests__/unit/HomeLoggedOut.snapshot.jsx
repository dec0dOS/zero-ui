import { render } from "@testing-library/react";
import HomeLoggedOut from "../../src/components/HomeLoggedOut";

it("renders HomeLoggedOut unchanged", () => {
  const { container } = render(<HomeLoggedOut />);
  expect(container).toMatchSnapshot();
});
