export interface SnapshotState {
    _counters: Map<string, number>;
    _updateSnapshot: "new" | "all" | "none";
    updated: number;
    added: number;
}

export interface JestTestConfiguration {
    snapshotState: SnapshotState;
    testPath: string;
    currentTestName: string;
    isNot: boolean;
}

export interface MatcherResult {
    message?(): string;
    pass: boolean;
    actual?: string;
    expected?: string;
}

/**
 * Checks whether the given input is a `SnapshotState` provided by jest.
 */
export function isSnapshotState(obj: any): obj is SnapshotState {
    if (typeof obj !== "object") { return false; }
    if (obj === null) { return false; }
    const { _counters, _updateSnapshot, updated, added } = obj;
    if (!(_counters instanceof Map)) { return false; }
    const isUpdateSnapshot = _updateSnapshot === "new" || _updateSnapshot === "none" || _updateSnapshot === "all";
    if (!isUpdateSnapshot) { return false; }
    if (typeof updated !== "number") { return false; }
    if (typeof added !== "number") { return false; }
    return true;
}

/**
 * Checks whether the given input is a `JestTestConfiguration` provided by jest.
 */
export function isJestTestConfiguration(obj: any): obj is JestTestConfiguration {
    if (typeof obj !== "object") { return false; }
    if (obj === null) { return false; }
    const { snapshotState, testPath, currentTestName, isNot } = obj;
    if (typeof testPath !== "string") { return false; }
    if (typeof currentTestName !== "string") { return false; }
    if (typeof isNot !== "boolean") { return false; }
    if (!isSnapshotState(snapshotState)) { return false; }
    return true;
}
