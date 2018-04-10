jest.mock("../to-match-image-snapshot");
import { jestScreenshot } from "..";
import { toMatchImageSnapshot } from "../to-match-image-snapshot";

describe("jestScreenshot", () => {
    const someBuffer = Buffer.alloc(10);

    it("uses `0` as relative threshold if no threshold is provided", () => {
        const result = jestScreenshot();
        result.toMatchImageSnapshot(someBuffer);
        expect(toMatchImageSnapshot).toHaveBeenCalledWith(
            someBuffer,
            { pixelThresholdRelative: 0 },
        );
    });

    it("returns an object with `toMatchImageSnapshot` set", () => {
        const result = jestScreenshot({
            detectAntialiasing: true,
            pixelThresholdAbsolute: 100,
        });
        expect(Object.keys(result)).toEqual([
            "toMatchImageSnapshot",
        ]);
        result.toMatchImageSnapshot(someBuffer);
        expect(toMatchImageSnapshot).toHaveBeenCalledWith(
            someBuffer,
            {
                detectAntialiasing: true,
                pixelThresholdAbsolute: 100,
            },
        );
    });
});
