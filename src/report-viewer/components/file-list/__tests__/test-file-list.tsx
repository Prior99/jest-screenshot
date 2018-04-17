import * as React from "react";
import { shallow } from "enzyme";
import { FileList } from "..";

describe("FileList", () => {
    it("looks as expected", () => {
        expect(shallow(<FileList />)).toMatchSnapshot();
    });
});
