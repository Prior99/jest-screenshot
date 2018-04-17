import * as React from "react";
import { shallow } from "enzyme";
import { Navigation } from "..";
import { StoreUi } from "../../../store";

describe("Navigation", () => {
    it("looks as expected", () => {
        expect(shallow(<Navigation />)).toMatchSnapshot();
    });

    it("clicking on the menu toggle button", () => {
        const element = shallow(<Navigation />);
        expect(tsdi.get(StoreUi).menuVisible).toBe(true);
        element.find("a.navbar-item").simulate("click");
        expect(tsdi.get(StoreUi).menuVisible).toBe(false);
    });
});
