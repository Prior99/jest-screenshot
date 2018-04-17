import * as React from "react";
import { shallow } from "enzyme";
import { DiffBlend } from "..";

describe("DiffBlend", () => {
    const someProps = {
        received: "reports/something/received.png",
        snapshot: "reports/something/snapshot.png",
        diff: "reports/something/diff.png",
        width: 100,
        height: 100,
    };

    it("looks as expected", () => {
        expect(shallow(<DiffBlend {...someProps} />)).toMatchSnapshot();
    });

    [0, 1, 0.7].forEach(opacity => {
        it(`when setting the diff opacity to ${opacity}`, () => {
            const element = shallow(<DiffBlend {...someProps} />);
            const input = element.find("input[type='range']").at(1);
            input.simulate("change", { currentTarget: { value: opacity }});
            expect(element).toMatchSnapshot();
            expect(element.find("div.viewer-container div.viewer-diff img").prop("style").opacity).toBe(opacity);
        });
    });

    [0, 1, 0.7].forEach(opacity => {
        it(`when setting the blending to ${opacity}`, () => {
            const element = shallow(<DiffBlend {...someProps} />);
            const input = element.find("input[type='range']").at(0);
            input.simulate("change", { currentTarget: { value: opacity }});
            expect(element).toMatchSnapshot();
            expect(element.find("div.viewer-container div.viewer-received img").prop("style").opacity).toBe(opacity);
        });
    });
});
