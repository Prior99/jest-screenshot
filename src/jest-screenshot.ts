import { ToMatchImageSnapshotConfiguration, toMatchImageSnapshot } from "./to-match-image-snapshot";
import { sync as mkdirp } from "mkdirp";

/**
 * This function is used to setup and initialize **jest-screenshot**.
 *
 * A configuration object can be passed as the first argument.
 *
 * @param configuration The configuration to setup **jest-screenshot** with.
 */
export function setupJestScreenshot(configuration: ToMatchImageSnapshotConfiguration = {}) {
    if (typeof expect === "undefined") {
        throw new Error("Jest: Could not find `expect`. Can't setup jest-screenshot.");
    }
    const { pixelThresholdAbsolute, pixelThresholdRelative } = configuration;
    if (typeof pixelThresholdAbsolute === "undefined" && typeof pixelThresholdRelative === "undefined") {
        configuration.pixelThresholdRelative = 0;
    }
    expect.extend({
        toMatchImageSnapshot(received: Buffer) {
            return toMatchImageSnapshot.call(this, received, configuration);
        },
    });
}
