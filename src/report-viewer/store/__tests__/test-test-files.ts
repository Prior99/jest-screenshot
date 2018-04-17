import { StoreTestFiles } from "..";

describe("StoreTestFiles", () => {
    beforeEach(() => {
        (global as any).testResults = {
            files: [
                { testFilePath: "some-path-1" },
                { testFilePath: "some-path-2" },
            ],
        };
    });

    it("stores the name", () => {
        const testFiles = tsdi.get(StoreTestFiles);
        testFiles.selectFile(testResults.files[1]);
        expect(testFiles.activeFileName).toBe("some-path-2");
    });

    it("retrieves the active file", () => {
        const testFiles = tsdi.get(StoreTestFiles);
        testFiles.selectFile(testResults.files[1]);
        expect(testFiles.activeFile).toBe(testResults.files[1]);
    });

    it("detects whether a file is active", () => {
        const testFiles = tsdi.get(StoreTestFiles);
        testFiles.selectFile(testResults.files[1]);
        expect(testFiles.isActive(testResults.files[0])).toBe(false);
        expect(testFiles.isActive(testResults.files[1])).toBe(true);
    });

    it("stores the first file initially", () => {
        expect(tsdi.get(StoreTestFiles).activeFile).toBe(testResults.files[0]);
    });

    it("stores nothing if no test results are present", () => {
        (global as any).testResults.files = [];
        expect(tsdi.get(StoreTestFiles).activeFile).toBeUndefined();
    });
});
