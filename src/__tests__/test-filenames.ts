import { getSnapshotFileName, getSnapshotPath } from "../filenames";
import { SnapshotState } from "../jest";

const somePath = "/tmp/some-test.ts";
const someTestName = "something with some parameters does expected things";
const someSnapshotState: SnapshotState = {
    _counters: new Map<string, number>(),
    _updateSnapshot: "new",
    updated: 0,
    added: 0,
};
const expectedGeneratedName = "some-test-ts-something-with-some-parameters-does-expected-things-8.snap.png";
someSnapshotState._counters.set(someTestName, 7);

describe("getSnapshotFileName", () => {
    describe("with a custom identifier generator", () => {
        it("uses the generator", () => {
            const expected = "some-generated-filename-identifier.snap.png";
            const identifier = (testPath: string, currentTestName: string, counter: number) => {
                expect(testPath).toBe(somePath);
                expect(currentTestName).toBe(someTestName);
                expect(counter).toBe(8);
                return expected;
            };
            expect(getSnapshotFileName(somePath, someTestName, someSnapshotState, { identifier })).toBe(expected);
        });

        it("appends `.snap.png` if the generator didn't append it", () => {
            const expected = "some-generated-filename-identifier.snap.png";
            const returned = "some-generated-filename-identifier";
            const identifier = () => {
                return returned;
            };
            expect(getSnapshotFileName(somePath, someTestName, someSnapshotState, { identifier })).toBe(expected);
        });

        it("throws an error if the generator wasn't a function but also not `undefined`", () => {
            const identifier = 89 as any;
            expect(() => {
                getSnapshotFileName(somePath, someTestName, someSnapshotState, { identifier });
            }).toThrowErrorMatchingSnapshot();
        });
    });

    it("generates the expected default file name with no generator specified", () => {
        expect(getSnapshotFileName(somePath, someTestName, someSnapshotState, {})).toBe(expectedGeneratedName);
    });
});

describe("getSnapshotPath", () => {
    it("returns the expected path", () => {
        const expectedGeneratedPath = `/tmp/__snapshots__/${expectedGeneratedName}`;
        expect(getSnapshotPath(somePath, someTestName, someSnapshotState, {})).toBe(expectedGeneratedPath);
    });

    it("returns the expected path with a custom directory specified", () => {
        const snapshotsDir = "__some_directory__";
        const expectedGeneratedPath = `/tmp/__some_directory__/${expectedGeneratedName}`;
        const path = getSnapshotPath(somePath, someTestName, someSnapshotState, { snapshotsDir });
        expect(path).toBe(expectedGeneratedPath);
    });
});
