import { render, screen } from "@testing-library/react";
import HomeLoggedIn from "components/HomeLoggedIn";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { testNetwork } from "../../data/network";
import userEvent from "@testing-library/user-event";
import API from "utils/API";
import { act } from "react-dom/test-utils";
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

  it("creates a new network when the 'Create A Network' button is clicked", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    jest.spyOn(Date, "now").mockImplementation(() => 1487076708000);

    let mock = new MockAdapter(API);
    const user = userEvent.setup();
    let testLocation;
    const networkId = "testid";

    // For the API call with the initial render
    mock.onGet("network").reply(200, []);

    // For the API call after the 'Create A Network' button is clicked
    mock.onPost("/network").reply(200, { config: { id: "testid" } });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Route path="/">
            <HomeLoggedIn />
          </Route>
          <Route
            path="*"
            render={({ location }) => {
              testLocation = location;
              return null;
            }}
          />
        </MemoryRouter>
      );
    });

    const createANetworkButton = screen.getByRole("button", {
      name: "Create A Network",
    });

    await user.click(createANetworkButton);
    expect(testLocation.pathname).toBe("/network/testid");
  });
});
