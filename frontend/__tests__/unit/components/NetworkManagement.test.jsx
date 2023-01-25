import { render, screen } from "@testing-library/react";
import NetworkManagement from "components/NetworkManagement";
import { MemoryRouter, Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import API from "utils/API";
import MockAdapter from "axios-mock-adapter";

describe("NetworkManagement", () => {
  it("renders unchanged", () => {
    const history = createMemoryHistory();

    const { container } = render(
      <Router history={history}>
        <NetworkManagement />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  test("renders with initial state (accordion not expanded)", () => {
    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <NetworkManagement />
      </Router>
    );

    const expandAccordionButton = screen.getByRole("button", {
      name: "Management",
    });

    expect(expandAccordionButton).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete Network" })
    ).toBeFalsy();
  });

  test("renders with accordion expanded (and dialog closed)", async () => {
    const history = createMemoryHistory();
    const user = userEvent.setup();

    render(
      <Router history={history}>
        <NetworkManagement />
      </Router>
    );

    const expandAccordionButton = screen.getByRole("button", {
      name: "Management",
    });

    await user.click(expandAccordionButton);

    expect(
      screen.getByRole("button", {
        name: "Delete Network",
      })
    ).toBeVisible();
  });

  test("renders with accordion expanded and dialog opened", async () => {
    const history = createMemoryHistory();
    const user = userEvent.setup();

    render(
      <Router history={history}>
        <NetworkManagement />
      </Router>
    );

    const expandAccordionButton = screen.getByRole("button", {
      name: "Management",
    });

    await user.click(expandAccordionButton);

    const deleteNetworkButton = screen.getByRole("button", {
      name: "Delete Network",
    });

    await user.click(deleteNetworkButton);

    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
  });

  test("renders with accordion closed after opening and closing it", async () => {
    const history = createMemoryHistory();
    const user = userEvent.setup();

    render(
      <Router history={history}>
        <NetworkManagement />
      </Router>
    );

    const expandAccordionButton = screen.getByRole("button", {
      name: "Management",
    });

    await user.click(expandAccordionButton);

    expect(
      screen.getByRole("button", {
        name: "Delete Network",
      })
    ).toBeVisible();

    await user.click(expandAccordionButton);

    expect(
      screen.queryByRole("button", {
        name: "Delete Network",
      })
    ).toBeFalsy();
  });

  test("renders with accordion expanded and dialog closed (after opening and closing the dialog)", async () => {
    const history = createMemoryHistory();
    const user = userEvent.setup();

    render(
      <Router history={history}>
        <NetworkManagement />
      </Router>
    );

    const expandAccordionButton = screen.getByRole("button", {
      name: "Management",
    });

    await user.click(expandAccordionButton);

    const deleteNetworkButton = screen.getByRole("button", {
      name: "Delete Network",
    });

    await user.click(deleteNetworkButton);

    const dialogCancelButton = screen.getByRole("button", { name: "Cancel" });
    const dialogDeleteButton = screen.getByRole("button", { name: "Delete" });

    expect(dialogCancelButton).toBeVisible();
    expect(dialogDeleteButton).toBeVisible();

    await user.click(dialogCancelButton);

    expect(dialogCancelButton).not.toBeVisible();
    expect(dialogDeleteButton).not.toBeVisible();
  });

  test("renders with network deleted (after expanding the acordion, opening the dialog and clicking the button to delete the network)", async () => {
    const mock = new MockAdapter(API);
    const user = userEvent.setup();
    const nwid = "123";
    let testLocation;

    mock.onDelete("/network/" + nwid).reply(200);

    render(
      <MemoryRouter initialEntries={["/network/" + nwid]}>
        <Route path="/network/:nwid">
          <NetworkManagement />
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

    const expandAccordionButton = screen.getByRole("button", {
      name: "Management",
    });

    await user.click(expandAccordionButton);

    const deleteNetworkButton = screen.getByRole("button", {
      name: "Delete Network",
    });

    await user.click(deleteNetworkButton);

    const dialogCancelButton = screen.getByRole("button", { name: "Cancel" });
    const dialogDeleteButton = screen.getByRole("button", { name: "Delete" });

    expect(dialogCancelButton).toBeVisible();
    expect(dialogDeleteButton).toBeVisible();

    await user.click(dialogDeleteButton);
    expect(testLocation.pathname).toBe("/");
  });
});
