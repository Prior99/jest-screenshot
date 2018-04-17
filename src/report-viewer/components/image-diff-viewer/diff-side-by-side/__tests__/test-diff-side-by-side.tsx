import * as React from "react";
import { shallow } from "enzyme";
import { DiffSideBySide } from "..";

describe("DiffSideBySide", () => {
    const someProps = {
        received: "reports/something/received.png",
        snapshot: "reports/something/snapshot.png",
        diff: "reports/something/diff.png",
        width: 100,
        height: 100,
    };

    it("looks as expected", () => {
        expect(shallow(<DiffSideBySide {...someProps} />)).toMatchSnapshot();
    });

    [0, 1, 0.7].forEach(opacity => {
        it(`when setting the diff opacity to ${opacity}`, () => {
            const element = shallow(<DiffSideBySide {...someProps} />);
            const input = element.find("input[type='range']");
            input.simulate("change", { currentTarget: { value: opacity }});
            expect(element).toMatchSnapshot();
            [
                element.find("div.viewer-container div.viewer-received div.viewer-diff img"),
                element.find("div.viewer-container div.viewer-snapshot div.viewer-diff img"),
            ].forEach(viewerDiffImg => {
                expect(viewerDiffImg.prop("style").opacity).toBe(opacity);
            });
        });
    });
});
