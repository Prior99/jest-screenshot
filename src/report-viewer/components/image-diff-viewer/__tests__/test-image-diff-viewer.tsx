import * as React from "react";
import { shallow } from "enzyme";
import { ImageDiffViewer } from "..";

describe("ImageDiffViewer", () => {
    it("looks as expected", () => {
        expect(shallow(
            <ImageDiffViewer
                received="reports/something/received.png"
                snapshot="reports/something/snapshot.png"
                diff="reports/something/diff.png"
                width={100}
                height={100}
            />,
        )).toMatchSnapshot();
    });

    [0, 1, 2].forEach(index => {
        it(`when clicking on tab #${index}`, () => {
            const element = shallow(
                <ImageDiffViewer
                    received="reports/something/received.png"
                    snapshot="reports/something/snapshot.png"
                    diff="reports/something/diff.png"
                    width={100}
                    height={100}
                />,
            );
            const liElementsBeforeClick = element.find("li");
            for (let i = 0; i < liElementsBeforeClick.length; ++i) {
                expect(liElementsBeforeClick.at(i).hasClass("is-active")).toBe(i === 0);
            }
            element.find("li").at(index).find("a").simulate("click");
            expect(element).toMatchSnapshot();
            const liElementsAfterClick = element.find("li");
            for (let i = 0; i < liElementsAfterClick.length; ++i) {
                expect(liElementsAfterClick.at(i).hasClass("is-active")).toBe(i === index);
            }
        });
    });
});
