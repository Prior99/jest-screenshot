(global as any).requestAnimationFrame = (callback: Function) => setTimeout(callback, 0);

import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { TSDI } from "tsdi";

let tsdi: TSDI;

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
    (global as any).testResults = {
        files: [
            {
                testFilePath: "src/__tests__/test-first.ts",
                failedTests: [
                    {
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
                                receivedPath:
                                    "jest-screenshot-report/reports/some-other-identifier.snap.png/received.png",
                                diffPath: "jest-screenshot-report/reports/some-other-identifier.snap.png/diff.png",
                                snapshotPath:
                                    "jest-screenshot-report/reports/some-other-identifier.snap.png/snapshot.png",
                                width: 10,
                                height: 10,
                            },
                        ],
                    },
                ],
            },
            {
                testFilePath: "src/__tests__/test-second.ts",
                failedTests: [
                    {
                        titles: ["The second thing", "with this specific behaviour", "does other things"],
                        failedSnapshots: [
                            {
                                testName: "The second snapshots",
                                message: "Received other message.",
                                changedRelative: 0.75,
                                totalPixels: 100,
                                changedPixels: 75,
                                testFileName: "src/__tests__/test-second.ts",
                                snapshotNumber: 1,
                                receivedPath:
                                    "jest-screenshot-report/reports/some-third-identifier.snap.png/received.png",
                                diffPath: "jest-screenshot-report/reports/some-third-identifier.snap.png/diff.png",
                                snapshotPath:
                                    "jest-screenshot-report/reports/some-third-identifier.snap.png/snapshot.png",
                                width: 5,
                                height: 20,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    tsdi = new TSDI();
    tsdi.enableComponentScanner();
});

afterEach(() => {
    tsdi.close();
});
