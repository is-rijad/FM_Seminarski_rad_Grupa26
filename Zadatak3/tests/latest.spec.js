const assert = require("assert");
const { elementLocator, getFirstVisibleChild, waitForLoadingToFinish } = require("../utils/elementUtil");
const { By, until, Key } = require("selenium-webdriver");

describe("Latest tests", function () {
    it("open latest, then load more twice", async function () {
        const latestNavLink = await elementLocator(By.css("a[href='/latest']"));
        await latestNavLink.click();
        await waitForLoadingToFinish();

        const viewAll = await global.driver.findElements(By.css("a[href*='/view-all']"));
        await viewAll[0].click();
        await waitForLoadingToFinish();

        for (let i = 0; i < 2; i++) {
            const loadMoreButton = await getFirstVisibleChild(By.xpath("//*[contains(@class, 'loadMoreBtn')]"), true);
            await global.driver.executeScript("arguments[0].click();", loadMoreButton);
            await global.driver.sleep(1000); // Wait for new items to load
        }

        assert.ok(true, "Latest load more test passed");
    });
    it("open latest, then search for an item and check counts", async function () {
        const latestNavLink = await elementLocator(By.css("a[href='/latest']"));
        await latestNavLink.click();
        await waitForLoadingToFinish();

        const searchButton = await elementLocator(By.xpath("//*[contains(@class, 'SearchInput') and contains(@class, 'searchIcon')]"));
        await searchButton.click();

        const searchInput = await elementLocator(By.css("input[placeholder='Šta tražite danas?']"));
        await searchInput.clear();
        await searchInput.sendKeys("jastuk");
        await global.driver.sleep(1000); // Wait for search suggestions to appear
        await searchInput.sendKeys(Key.ENTER);
        await waitForLoadingToFinish();

        const products = await global.driver.findElements(By.xpath("//*[contains(@class, 'style-module') and contains(@class, 'item-container')]/a"));
        const tabs = await global.driver.findElements(By.xpath("//*[contains(@class, 'item') and contains(@class, 'tab-module') and contains(@class, 'menuItem')]"));
        const productsCount = parseInt(await tabs[0].findElement(By.css('div')).getText());
        let loadMoreButton;
        try {
            loadMoreButton = await global.driver.wait(
                until.elementLocated(By.xpath("//*[contains(@class, 'scroll-wrapper') and contains(@class, 'loadMoreBtn')]")),
                500
            );
        } catch (e) {
            loadMoreButton = null;
        }
        if (loadMoreButton) {
            assert.ok(products.length == 12 && products.length < productsCount, "Products displayed should be less than total count");
        } else {
            assert.equal(products.length, productsCount, "Products displayed should equal total count");
        }
    });
});
