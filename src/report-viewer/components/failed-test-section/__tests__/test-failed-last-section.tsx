import * as React from "react";
import { shallow } from "enzyme";
import { FailedTestSection } from "..";

describe("FailedTestSection", () => {
    const someFailedTest = {
        titles: ["The thing", "with this other thing", "does things"],
        failedSnapshots: [
            {
                testName: "The first snapshots",
                message: "Received message.",
                changedRelative: 0.5,
                totalPixels: 10,
                changedPixels: 5,
                testFileName: "src/__tests__/test-first.ts",
                snapshotNumber: 1,
                receivedPath: "jest-screenshot-report/reports/some-identifier.snap.png/received.png",
                diffPath: "jest-screenshot-report/reports/some-identifier.snap.png/diff.png",
                snapshotPath: "jest-screenshot-report/reports/some-identifier.snap.png/snapshot.png",
                width: 5,
                height: 2,
            },
            {
                testName: "The first snapshots",
                message: "Received message.",
                changedRelative: 0.2,
                totalPixels: 100,
                changedPixels: 20,
                testFileName: "src/__tests__/test-first.ts",
                snapshotNumber: 2,
                receivedPath: "jest-screenshot-report/reports/some-other-identifier.snap.png/received.png",
                diffPath: "jest-screenshot-report/reports/some-other-identifier.snap.png/diff.png",
                snapshotPath: "jest-screenshot-report/reports/some-other-identifier.snap.png/snapshot.png",
                width: 10,
                height: 10,
            },
        ],
    };

    it("looks as expected", () => {
        expect(shallow(<FailedTestSection failedTest={someFailedTest} />)).toMatchSnapshot();
    });
});
