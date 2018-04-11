# jest-screenshot

[![npm](https://img.shields.io/npm/v/jest-screenshot.svg)](https://www.npmjs.com/package/jest-screenshot)
[![Build Status](https://travis-ci.org/Prior99/jest-screenshot.svg?branch=master)](https://travis-ci.org/Prior99/jest-screenshot)
[![Coverage Status](https://coveralls.io/repos/github/Prior99/jest-screenshot/badge.svg?branch=master)](https://coveralls.io/github/Prior99/jest-screenshot?branch=master)

A jest extension to deal with screenshots and all sorts of images. Inspired by the awesome [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot) and
providing a mostly compatible API with similar features. By utilizing [native-image-diff](https://github.com/Prior99/native-image-diff) instead of [pixelmatch](https://github.com/mapbox/pixelmatch)
and [node-libpng](https://github.com/Prior99/node-libpng) instead of [pngjs](https://github.com/lukeapage/pngjs) the tests will run much faster than its competitor.

Please also refer to the **[Documentation](https://prior99.github.io/jest-screenshot/docs/index.html)**.

## Table of contents

 * [jest-screenshot](#jest-screenshot)
    * [Table of contents](#table-of-contents)
    * [Usage](#usage)
        * [Configuring](#configuring)
    * [Contributing](#contributing)
    * [Contributors](#contributors)

## Usage

Integrate this plugin by using jest's `expect.extend`:

```typescript
import { jestScreenshot } from "jest-screenshot";

expect.extend(jestScreenshot());
```

Take a look at [the example project](example/).

Afterwards, it can be used to compare images with snapshots:

```typescript
describe("My fancy image", () => {
    const myFancyImage = readFileSync("../my-fancy-image.png");

    it("looks as beautiful as always", () => {
        expect(myFancyImage).toMatchImageSnapshot();
    });
});
```

This is for example useful for integration tests with [puppeteer](https://github.com/GoogleChrome/puppeteer):

```typescript
describe("My fancy webpage", () => {
    const page = ...; // Setup puppeteer.

    it("looks as gorgeous as ever", async () => {
        expect(await page.screenshot()).toMatchImageSnapshot();
    });
});
```

### Configuring

`jestScreenshot()` takes [an optional first argument](https://prior99.github.io/jest-screenshot/docs/interfaces/tomatchimagesnapshotconfiguration.html) with an object to configure it:

| Parameter                | type     | default         | Optional | Description
|--------------------------|----------|-----------------|----------|-----------------------------------------|
| `detectAntialiasing`     | boolean  | `true`          | ✓        | Whether to attempt to detect antialiasing and ignore related changes when comparing both images. [See documentation](https://prior99.github.io/native-image-diff/docs/interfaces/diffimagesarguments.html#detectantialiasing). |
| `colorThreshold`         | number   | `0.1`           | ✓        | A number in the range from `0` to `1` describing how sensitive the comparison of two pixels should be. [See documentation](https://prior99.github.io/native-image-diff/docs/interfaces/diffimagesarguments.html#colorthreshold). |
| `pixelThresholdAbsolute` | number   | `undefined`     | ✓        | If specified, **jest-screenshot** will fail if more than the specified pixels are different from the snapshot. |
| `pixelThresholdRelative` | number   | `0`             | ✓        | If specified, **jest-screenshot** will fail if more than the specified relative amount of pixels are different from the snapshot. When setting this to `0.5` for example, more than 50% of the pixels need to be different for the test to fail. |
| `identifier`             | function |                 | ✓        | A function with the following signature: `(testPath: string, testName: string, counter: number) => string` which generates the filename for the snapshot. The filename needs to be unique. A sane default generator is implemented. |
| `snapshotsDir`           | string   | `__snapshots__` | ✓        | If specified, will change the directory into which the snapshot images will be stored. Together with `identifier` this defines the absolute path to the file. |

#### Example

```typescript
import { jestScreenshot } from "jest-screenshot";

expect.extend(jestScreenshot({
    detectAntialiasing: false,
    colorThreshold: 0,
    pixelThresholdAbsolute: 150, // Fail if more than 150 pixels in total changed.
    pixelThresholdRelative: 0.5 // Fail if more than 50% of the pixels changed.
}));
```

If neither `pixelThresholdAbsolute` nor `pixelThresholdRelative` are specified, `pixelThresholdRelative` will be set to `0`.
Both can be specified together in order to make the test fail on both conditions.

## Contributing

Yarn is used instead of npm, so make sure it is installed. `npm install -g yarn`.

Generally, it should be enough to just run:

```
make
```

which will install all node dependencies, compile typescript, execute all test,
lint the sources and build the docs.

## Contributors

 - Frederick Gnodtke
