const assert = require("assert");
const { elementLocator, getFirstVisibleChild, waitForLoadingToFinish } = require("../utils/elementUtil");
const { By, until, Key } = require("selenium-webdriver");

describe("Bazar tests", function () {
    it("open one of popular bazars, then open first item and check its name", async function () {
        const firstPopularBazar = await getFirstVisibleChild(By.xpath("//h2[normalize-space()='Popularni bazari']/parent::*/parent::*/div[last()]/div/div/div[last()]/a[1]"), true);
        await firstPopularBazar.click();
        await waitForLoadingToFinish();

        const viewAllNavLink = await elementLocator(By.css("a[href*='/view-all']"));
        await viewAllNavLink.click();
        await waitForLoadingToFinish();

        const firstItem = await elementLocator(By.xpath("//*[contains(@class, 'item-container')]/a[1]"));
        const firstItemName = await firstItem.findElement(By.xpath("//*[contains(@class, 'itemInfo')]/h3[last()]")).getText();
        await firstItem.click();
        await waitForLoadingToFinish();

        const itemTitleElement = await elementLocator(By.xpath("//*[contains(@class, 'VariantHandle') and contains(@class, 'title')]"));
        assert.equal(await itemTitleElement.getText(), firstItemName, "Item title does not match the name from bazar page");
    });
});
