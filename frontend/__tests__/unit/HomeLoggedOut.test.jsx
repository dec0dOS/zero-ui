import { render, screen } from "@testing-library/react";
import HomeLoggedOut from "../../src/components/HomeLoggedOut";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { act } from "react-dom/test-utils";

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

describe("HomeLoggedOut", () => {
  test("renders HomeLoggedOut when authentication is enabled", () => {
    const history = createMemoryHistory();
    const goSpy = jest.spyOn(history, "go");

    mock.onGet("/auth/login").reply(200, { enabled: true });

    render(
      <Router history={history}>
        <HomeLoggedOut />
      </Router>
    );

    const projectDescription = screen.getByRole("heading", {
      name: "ZeroUI - ZeroTier Controller Web UI - is a web user interface for a self-hosted ZeroTier network controller.",
    });

    const loginMessage = screen.getByText(/Please Log In to continue/i);

    expect(projectDescription).toBeInTheDocument();
    expect(loginMessage).toBeInTheDocument();
    expect(goSpy).not.toHaveBeenCalled();
  });

  test("renders HomeLoggedOut when authentication is disabled", async () => {
    const history = createMemoryHistory();
    const goSpy = jest.spyOn(history, "go");

    mock.onGet("/auth/login").reply(200, { enabled: false });

    await act(async () => {
      render(
        <Router history={history}>
          <HomeLoggedOut />
        </Router>
      );
    });

    const projectDescription = screen.getByRole("heading", {
      name: "ZeroUI - ZeroTier Controller Web UI - is a web user interface for a self-hosted ZeroTier network controller.",
    });

    const loginMessage = screen.getByText(/Please Log In to continue/i);

    expect(projectDescription).toBeInTheDocument();
    expect(loginMessage).toBeInTheDocument();
    expect(goSpy).toHaveBeenCalled();
  });
});
