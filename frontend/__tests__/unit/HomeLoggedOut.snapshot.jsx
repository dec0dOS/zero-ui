import { render } from "@testing-library/react";
import HomeLoggedOut from "HomeLoggedOut";

it("renders HomeLoggedOut unchanged", () => {
  const { container } = render(<HomeLoggedOut />);
  expect(container).toMatchSnapshot();
});
