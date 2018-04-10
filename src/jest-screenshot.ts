import { ToMatchImageSnapshotConfiguration, toMatchImageSnapshot } from "./to-match-image-snapshot";

export function jestScreenshot(configuration: ToMatchImageSnapshotConfiguration = {}) {
    const { pixelThresholdAbsolute, pixelThresholdRelative } = configuration;
    if (typeof pixelThresholdAbsolute === "undefined" && typeof pixelThresholdRelative === "undefined") {
        configuration.pixelThresholdRelative = 0;
    }
    return {
        toMatchImageSnapshot(received: Buffer) {
            return toMatchImageSnapshot.call(this, received, configuration);
        },
    };
}
