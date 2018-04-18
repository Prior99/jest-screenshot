import { setupJestScreenshot } from "jest-screenshot";
import { readFileSync } from "fs";

setupJestScreenshot();

const redditImage = readFileSync(`${__dirname}/fixtures/reddit.png`);
const npmjsImage = readFileSync(`${__dirname}/fixtures/npmjs.png`);

for (let i = 0; i < 10; ++i) {
    it(`matches the snapshot #${i}`, () => {
        expect(npmjsImage).toMatchImageSnapshot();
    });
}

for (let i = 0; i < 10; ++i) {
    it(`creates a new snapshot #${i}`, () => {
        expect(npmjsImage).toMatchImageSnapshot();
    });
}

for (let i = 0; i < 10; ++i) {
    it(`fails to match the snapshot #${i}`, () => {
        expect(redditImage).toMatchImageSnapshot();
    });
}
