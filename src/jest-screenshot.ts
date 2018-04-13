import { toMatchImageSnapshot } from "./to-match-image-snapshot";
import { sync as mkdirp } from "mkdirp";
import { JestScreenshotConfiguration, config } from "./config";

/**
 * This function is used to setup and initialize **jest-screenshot**.
 *
 * A configuration object can be passed as the first argument.
 */
export function setupJestScreenshot() {
    if (typeof expect === "undefined") {
        throw new Error("Jest: Could not find `expect`. Can't setup jest-screenshot.");
    }
    expect.extend({
        toMatchImageSnapshot(received: Buffer) {
            return toMatchImageSnapshot.call(this, received, config());
        },
    });
}
