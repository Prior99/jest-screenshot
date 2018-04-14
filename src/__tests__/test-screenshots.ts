import { setupJestScreenshot } from "..";
import { readFileSync } from "fs";

describe("screenshots", () => {
    beforeEach(() => {
        setupJestScreenshot();
    });

    it("stackoverflow", () => {
        expect(() => {
            expect(readFileSync(`${__dirname}/fixtures/screenshot-stackoverflow.png`)).toMatchImageSnapshot();
        }).toThrowErrorMatchingSnapshot();
    });

    it("npmjs", () => {
        expect(() => {
            expect(readFileSync(`${__dirname}/fixtures/screenshot-npmjs.png`)).toMatchImageSnapshot();
        }).toThrowErrorMatchingSnapshot();
    });
});
