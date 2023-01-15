import { render, screen } from "@testing-library/react";
import NetworkButton from "components/HomeLoggedIn/components/NetworkButton";
import { testNetwork } from "../../data/network";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

describe("NetworkHeader", () => {
  it("renders NetworkButton unchanged", () => {
    const history = createMemoryHistory();

    const { container } = render(
      <Router history={history}>
        <NetworkButton network={testNetwork} />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  test("renders NetworkHeader with a test network", () => {
    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <NetworkButton network={testNetwork} />
      </Router>
    );

    const networkButton = screen.getByRole("button", {
      name: "0d303702cd0f1fc6 new-net-11166",
    });

    const networkLink = screen.getByRole("link", {
      name: "0d303702cd0f1fc6 new-net-11166",
    });

    expect(networkButton).toBeInTheDocument();
    expect(networkLink).toBeInTheDocument();
  });
});
