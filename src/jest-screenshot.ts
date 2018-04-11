import { ToMatchImageSnapshotConfiguration, toMatchImageSnapshot } from "./to-match-image-snapshot";
import { sync as mkdirp } from "mkdirp";

/**
 * This function is used to setup and initialize **jest-screenshot**. It should be used in
 * combination with `expect.extend`:
 *
 * ```
 * expect.extend(jestScreenshot());
 * ```
 *
 * A configuration object can be passed as the first argument.
 *
 * @param configuration The configuration to setup **jest-screenshot** with.
 *
 * @return A configuration intended to be used with `expect.extend`.
 */
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
