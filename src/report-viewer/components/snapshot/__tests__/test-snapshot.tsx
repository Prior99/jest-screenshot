import * as React from "react";
import { shallow } from "enzyme";
import { Snapshot } from "..";

describe("Snapshot", () => {
    it("looks as expected", () => {
        expect(shallow(
            <Snapshot
                snapshot={testResults.files[0].failedTests[0].failedSnapshots[0]}
            />,
        )).toMatchSnapshot();
    });
});
