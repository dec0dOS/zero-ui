import { render } from "@testing-library/react";
import Bar from "components/Bar";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

// Useful reference: https://bholmes.dev/blog/mocking-browser-apis-fetch-localstorage-dates-the-easy-way-with-jest/

let mockStorage = {};

describe("Bar", () => {
  beforeAll(() => {
    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
  });

  beforeEach(() => {
    // make sure the fridge starts out empty for each test
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
});
