import { render, screen } from "@testing-library/react";
import NetworkHeader from "components/NetworkHeader";
import { testNetwork } from "../../data/network";

describe("NetworkHeader", () => {
  it("renders NetworkHeader unchanged", () => {
    const { container } = render(<NetworkHeader network={testNetwork} />);
    expect(container).toMatchSnapshot();
  });

  test("renders NetworkHeader with a test network", () => {
    render(<NetworkHeader network={testNetwork} />);

    const networkId = screen.getByRole("heading", {
      name: "0d303702cd0f1fc6",
      level: 5,
    });

    const networkName = screen.getByRole("heading", {
      name: "new-net-11166",
      level: 6,
    });

    const networkDescription = screen.getByText(/Test Network/);

    expect(networkId).toBeInTheDocument();
    expect(networkName).toBeInTheDocument();
    expect(networkDescription).toBeInTheDocument();
  });
});
