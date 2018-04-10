import { jestScreenshot } from "..";
import { readFileSync } from "fs";

describe("toMatchImageSnapshot", () => {
    beforeAll(() => {
        expect.extend(jestScreenshot());
    });

    it("detects a matching snapshot as matching", () => {
        expect(() => {
            expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-gradient.png`)).toMatchImageSnapshot();
        }).not.toThrowError();
    });

    [
        { colorThreshold: 0.7 },
    ].forEach(({ colorThreshold }) => {
        it(`with a color threshold of ${colorThreshold} detects the snapshot as matching`, () => {
            expect.extend(jestScreenshot({ colorThreshold }));
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
            }).not.toThrowError();
        });
    });

    [
        { colorThreshold: 0.0 },
        { colorThreshold: 0.1 },
        { colorThreshold: 0.5 },
        { colorThreshold: 0.6 },
    ].forEach(({ colorThreshold }) => {
        it(`with a color threshold of ${colorThreshold} detects the snapshot as not matching`, () => {
            expect.extend(jestScreenshot({ colorThreshold }));
            expect(() => {
                expect(readFileSync(`${__dirname}/fixtures/red-rectangle-example-red.png`)).toMatchImageSnapshot();
            }).toThrowErrorMatchingSnapshot();
        });
    });
});
