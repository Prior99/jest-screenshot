describe("github.com", () => {
    it("looks as expected", async () => {
        await page.goto("https://www.github.com/", { waitUntil: 'networkidle0' });
        expect(await page.screenshot()).toMatchImageSnapshot();
    });
});
