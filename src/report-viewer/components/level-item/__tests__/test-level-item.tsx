import * as React from "react";
import { shallow } from "enzyme";
import { LevelItem } from "..";

describe("LevelItem", () => {
    it("looks as expected", () => {
        expect(shallow(
            <LevelItem
                name="Some name"
                value="Some value"
            />,
        )).toMatchSnapshot();
    });
});
