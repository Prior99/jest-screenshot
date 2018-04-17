import * as React from "react";
import { shallow } from "enzyme";
import { Sidebar } from "..";

describe("Sidebar", () => {
    it("looks as expected", () => {
        expect(shallow(<Sidebar />)).toMatchSnapshot();
    });
});
