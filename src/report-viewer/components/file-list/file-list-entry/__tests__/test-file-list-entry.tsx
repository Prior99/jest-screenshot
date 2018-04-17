import * as React from "react";
import { shallow } from "enzyme";
import { FileListEntry } from "..";

describe("FileListEntry", () => {
    it("looks as expected", () => {
        expect(shallow(
            <FileListEntry
                file={testResults.files[0]}
            />,
        )).toMatchSnapshot();
    });

    it("changes the selected file", () => {
        const element = shallow(<FileListEntry file={testResults.files[1]} />);
        expect(element.find("a").hasClass("is-active")).toBe(false);
        element.find("a").simulate("click");
        expect(element.find("a").hasClass("is-active")).toBe(true);
    });
});
