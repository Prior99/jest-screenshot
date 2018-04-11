describe("npmjs.com", () => {
    it("looks as expected", async () => {
        await page.goto("https://www.npmjs.com/", { waitUntil: 'networkidle0' });
        expect(await page.screenshot()).toMatchImageSnapshot();
        await (await page.$("#search > div > input")).type("jest-screenshot\n");
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        expect(await page.screenshot()).toMatchImageSnapshot();
    });
});
