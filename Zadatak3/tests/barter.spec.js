const assert = require("assert");
const config = require("../config/config");
const { elementLocator, getFirstVisibleChild, waitForLoadingToFinish } = require("../utils/elementUtil");
const { By, until, Key } = require("selenium-webdriver");

describe("Barter tests", function () {
    it("open barter, then open first item and open contact merchant", async function () {
        const barterNavLink = await elementLocator(By.css("a[href*='/trampa']"));
        await barterNavLink.click();
        await waitForLoadingToFinish();

        const viewAllNavLink = await elementLocator(By.css("a[href*='/view-all']"));
        await viewAllNavLink.click();
        await waitForLoadingToFinish();

        const firstItem = await elementLocator(By.xpath("//*[contains(@class, 'item-container')]/a[1]"));
        await firstItem.click();
        await waitForLoadingToFinish();

        const contactMerchantButton = await elementLocator(By.xpath("//button[normalize-space()='Kontaktiraj trgovca']"));
        await contactMerchantButton.click();

        const contactDialog = await global.driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'user-chat-module') and contains(@class, 'portal')]")), config.timeout);
        assert.ok(await contactDialog.isDisplayed(), "Contact merchant dialog is not displayed");
    });
});
