describe("github.com", () => {
    it("frontpage looks as expected", async () => {
        await page.goto("https://www.github.com/");
        expect(await page.screenshot()).toMatchImageSnapshot();
    });

    it("trending looks as expected", async () => {
        await page.goto("https://github.com/trending");
        expect(await page.screenshot()).toMatchImageSnapshot();
    });
});
