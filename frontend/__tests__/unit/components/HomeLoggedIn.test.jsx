import { render, screen } from "@testing-library/react";
import HomeLoggedIn from "components/HomeLoggedIn";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { testNetwork } from "../../data/network";
import API from "utils/API";
import MockAdapter from "axios-mock-adapter";

describe("HomeLoggedIn", () => {
  it("renders HomeLoggedIn unchanged (no network)", async () => {
    const mock = new MockAdapter(API);
    const history = createMemoryHistory();

    mock.onGet("network").reply(200, []);

    const { container } = render(
      <Router history={history}>
        <HomeLoggedIn />
      </Router>
    );

    expect(
      await screen.findByText(/Please create at least one network/i)
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders HomeLoggedIn unchanged (with network)", async () => {
    const mock = new MockAdapter(API);
    const history = createMemoryHistory();

    mock.onGet("network").reply(200, [testNetwork]);

    const { container } = render(
      <Router history={history}>
        <HomeLoggedIn />
      </Router>
    );

    expect(await screen.findByText(/0d303702cd0f1fc6/)).toBeInTheDocument();
    expect(await screen.findByText(/new-net-11166/)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
