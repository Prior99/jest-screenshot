import * as React from "react";
import { shallow } from "enzyme";
import { FailedTestSection } from "..";

describe("FailedTestSection", () => {
    it("looks as expected", () => {
        expect(shallow(
            <FailedTestSection
                failedTest={testResults.files[0].failedTests[0]}
            />,
        )).toMatchSnapshot();
    });
});
