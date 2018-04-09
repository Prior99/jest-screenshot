import { ToMatchImageSnapshotConfiguration, configureToMatchImageSnapshot } from "./to-match-image-snapshot";

export function jestScreenshot(configuration?: ToMatchImageSnapshotConfiguration) {
    return {
        toMatchImageSnapshot: configureToMatchImageSnapshot(configuration),
    };
}
