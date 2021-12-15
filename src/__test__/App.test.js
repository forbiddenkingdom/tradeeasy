import React, { ReactDOM } from "react";
import { render, screen } from "@testing-library/react";
import App from "views/_app";

describe("app testing suite", () => {
  it("app starts without crashing", () => {
    render(<App />);
  });
});
