import { render } from "@testing-library/react";
import App from "./App";

// PUBLIC_INTERFACE
test("renders app root without crashing", () => {
  /**
   * This minimal smoke test verifies the App component renders.
   * We avoid text assertions that depend on dynamic UI content.
   */
  render(<App />);
});
