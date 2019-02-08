import { toMatchImageSnapshot, ToMatchImageSnapshotParameters } from "./to-match-image-snapshot";
import { sync as mkdirp } from "mkdirp";
import { JestScreenshotConfiguration, config } from "./config";

/**
 * This function is used to setup and initialize **jest-screenshot**.
 *
 * A configuration object can be passed as the first argument.
 */
export function setupJestScreenshot(customConfig = {}) {
    if (typeof expect === "undefined") {
        throw new Error("Jest: Could not find `expect`. Can't setup jest-screenshot.");
    }
    expect.extend({
        toMatchImageSnapshot(received: Buffer, parameters: ToMatchImageSnapshotParameters) {
            return toMatchImageSnapshot.call(this, received, config(customConfig), parameters);
        },
    });
}
