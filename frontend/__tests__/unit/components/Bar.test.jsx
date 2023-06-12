import { render, screen } from "@testing-library/react";
import Bar from "components/Bar";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";

// Useful reference: https://bholmes.dev/blog/mocking-browser-apis-fetch-localstorage-dates-the-easy-way-with-jest/

let mockStorage = {};

describe("Bar", () => {
  beforeAll(() => {
    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
    global.Storage.prototype.clear = jest.fn(() => (mockStorage = {}));
  });

  beforeEach(() => {
    mockStorage = {};
  });

  afterAll(() => {
    global.Storage.prototype.getItem.mockReset();
  });

  it("renders Bar unchanged when logged out", () => {
    const history = createMemoryHistory();
    mockStorage["loggedIn"] = false;

    const { container } = render(
      <Router history={history}>
        <Bar />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders Bar unchanged when logged in", () => {
    const history = createMemoryHistory();
    mockStorage["loggedIn"] = true;

    const { container } = render(
      <Router history={history}>
        <Bar />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders Bar unchanged when logged in, after clicking button to open menu", async () => {
    const history = createMemoryHistory();
    const user = userEvent.setup();
    mockStorage["loggedIn"] = true;

    const { container } = render(
      <Router history={history}>
        <Bar />
      </Router>
    );

    const menuButton = screen.getByRole("button", {
      name: "",
    });

    await user.click(menuButton);

    const logOutMenuItem = screen.getByRole("menuitem", {
      name: "Log out",
    });
    expect(logOutMenuItem).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test("open and close menu when logged in", async () => {
    const history = createMemoryHistory();
    const user = userEvent.setup();
    mockStorage["loggedIn"] = true;

    render(
      <Router history={history}>
        <Bar />
      </Router>
    );

    const menuButton = screen.getByRole("button", {
      name: "",
    });

    // Open menu
    await user.click(menuButton);

    const logOutMenuItem = screen.getByRole("menuitem", {
      name: "Log out",
    });
    expect(logOutMenuItem).toBeInTheDocument();

    // Close menu
    await user.keyboard("{Escape}");

    expect(logOutMenuItem).not.toBeInTheDocument();
  });

  test("open menu and click on 'Log out'", async () => {
    const user = userEvent.setup();
    mockStorage["loggedIn"] = true;
    let testLocation;

    render(
      <MemoryRouter initialEntries={["/test-url/"]}>
        <Route path="/test-url">
          <Bar />
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

    const menuButton = screen.getByRole("button", {
      name: "",
    });

    // Open menu
    await user.click(menuButton);

    const logOutMenuItem = screen.getByRole("menuitem", {
      name: "Log out",
    });
    expect(logOutMenuItem).toBeInTheDocument();

    // Click on 'Log out'
    await user.click(logOutMenuItem);

    expect(Object.keys(mockStorage).length).toBe(0);
    expect(testLocation.pathname).toBe("/");
  });
});
