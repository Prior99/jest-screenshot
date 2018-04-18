import * as React from "react";
import { shallow } from "enzyme";
import { Sidebar } from "..";
import { StoreUi } from "../../../store";

describe("Sidebar", () => {
    it("looks as expected", () => {
        expect(shallow(<Sidebar />)).toMatchSnapshot();
    });

    it("isn't rendered with the sidebar hidden", () => {
        tsdi.get(StoreUi).toggleMenu();
        expect(shallow(<Sidebar />)).toMatchSnapshot();
    });
});
