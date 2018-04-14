describe("npmjs.com", () => {
    it("looks as expected", async () => {
        await page.goto("https://www.npmjs.com/");
        expect(await page.screenshot()).toMatchImageSnapshot();
    });
});
