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
        );
    });

    it("returns an object with `toMatchImageSnapshot` set", () => {
        setupJestScreenshot({
            detectAntialiasing: true,
            pixelThresholdAbsolute: 100,
        });
        expect(expect("test").toMatchImageSnapshot).toBeTruthy();
        expect(someBuffer).toMatchImageSnapshot();
        expect(toMatchImageSnapshot).toHaveBeenCalledWith(
            someBuffer,
            {
                detectAntialiasing: true,
                pixelThresholdAbsolute: 100,
            },
        );
    });
});
