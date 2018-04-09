declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchImageSnapshot(): R;
        }
    }
}

export { jestScreenshot } from "./jest-screenshot";
export {
    toMatchImageSnapshot,
    configureToMatchImageSnapshot,
    ToMatchImageSnapshotConfiguration,
} from "./to-match-image-snapshot";
