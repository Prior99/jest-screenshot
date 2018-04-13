declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchImageSnapshot(): R;
        }
    }
}

export { setupJestScreenshot } from "./jest-screenshot";
export { toMatchImageSnapshot } from "./to-match-image-snapshot";
export { JestScreenshotConfiguration } from "./config";
