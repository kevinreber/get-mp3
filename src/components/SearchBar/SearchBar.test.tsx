import { render } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  test("it should match the snapshot", () => {
    const { asFragment } = render(<SearchBar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
