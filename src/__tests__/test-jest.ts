import { isSnapshotState, isJestTestConfiguration } from "../jest";

describe("isSnapshotState", () => {
    [
        "",
        100,
        undefined,
        null, // tslint:disable-line
        false,
        true,
        [],
        {},
        {
            _counters: { get() { return 0; } },
            _updateSnapshot: "all",
            updated: 0,
            added: 0,
        },
        {
            _counters: new Map<string, number>(),
            _updateSnapshot: "nope",
            updated: 0,
            added: 0,
        },
        {
            _counters: new Map<string, number>(),
            _updateSnapshot: "all",
            updated: "0",
            added: 0,
        },
        {
            _counters: new Map<string, number>(),
            _updateSnapshot: "all",
            updated: 0,
            added: "0",
        },
    ].forEach((snapshotState) => {
        it(`detects "${JSON.stringify(snapshotState)}" as not a snapshot state`, () => {
            expect(isSnapshotState(snapshotState)).toBe(false);
        });
    });

    it("detects a valid snapshot state as snapshot state", () => {
        expect(isSnapshotState({
            _counters: new Map<string, number>(),
            _updateSnapshot: "all",
            updated: 0,
            added: 0,
        })).toBe(true);
    });
});

describe("isJestTestConfiguration", () => {
    const someSnapshotState = {
        _counters: new Map<string, number>(),
        _updateSnapshot: "new",
        updated: 0,
        added: 0,
    };

    [
        "",
        100,
        undefined,
        null, // tslint:disable-line
        false,
        true,
        [],
        {},
        {
            testPath: 89,
            currentTestName: "some test",
            snapshotState: someSnapshotState,
            isNot: true,
        },
        {
            testPath: "/tmp/test.ts",
            snapshotState: someSnapshotState,
            isNot: true,
        },
        {
            testPath: "/tmp/test.ts",
            currentTestName: "some test",
            snapshotState: someSnapshotState,
            isNot: "yes",
        },
        {
            testPath: "/tmp/test.ts",
            currentTestName: "some test",
            snapshotState: {},
            isNot: false,
        },
    ].forEach((configuration) => {
        it(`detects "${JSON.stringify(configuration)}" as not a jest test configuration`, () => {
            expect(isJestTestConfiguration(configuration)).toBe(false);
        });
    });

    it("detects a valid jest test configuration as a jest test configuration", () => {
        expect(isJestTestConfiguration({
            snapshotState: someSnapshotState,
            testPath: "/tmp/test.ts",
            currentTestName: "some test",
            isNot: true,
        })).toBe(true);
    });
});
