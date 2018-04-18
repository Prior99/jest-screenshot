import * as React from "react";
import { shallow } from "enzyme";
import { Main } from "..";
import { StoreUi } from "../../../store";

describe("Main", () => {
    it("looks as expected", () => {
        expect(shallow(<Main />)).toMatchSnapshot();
    });

    it("looks as expected with no reports", () => {
        testResults.files = [];
        expect(shallow(<Main />)).toMatchSnapshot();
    });

    it("toggles the menu visibility", () => {
        const element = shallow(<Main />);
        expect(element.find("main").hasClass("is-9")).toBe(true);
        expect(element.find("main").hasClass("is-12")).toBe(false);

        tsdi.get(StoreUi).toggleMenu();
        element.update();
        expect(element).toMatchSnapshot();
        expect(element.find("main").hasClass("is-9")).toBe(false);
        expect(element.find("main").hasClass("is-12")).toBe(true);

        tsdi.get(StoreUi).toggleMenu();
        element.update();
        expect(element).toMatchSnapshot();
        expect(element.find("main").hasClass("is-9")).toBe(true);
        expect(element.find("main").hasClass("is-12")).toBe(false);
    });
});
