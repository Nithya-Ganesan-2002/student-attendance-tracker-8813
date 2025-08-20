import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login page by default when unauthenticated", () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /login/i });
  expect(button).toBeInTheDocument();
});
