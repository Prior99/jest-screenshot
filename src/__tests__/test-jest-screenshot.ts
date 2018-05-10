jest.mock("../to-match-image-snapshot");
import { setupJestScreenshot } from "..";
import { toMatchImageSnapshot } from "../to-match-image-snapshot";

describe("jestScreenshot", () => {
    const someBuffer = Buffer.alloc(10);

    it("uses `0` as relative threshold if no threshold is provided", () => {
        setupJestScreenshot();
        expect(someBuffer).toMatchImageSnapshot();
        expect(toMatchImageSnapshot).toHaveBeenCalledWith(
            someBuffer,
            { pixelThresholdRelative: 0 },
            undefined,
        );
    });

    it("throws an error if called outside of jest", () => {
        const originalExpect = expect;
        (global as any).expect = undefined;
        originalExpect(() => setupJestScreenshot()).toThrowErrorMatchingSnapshot();
        (global as any).expect = originalExpect;
    });
});
