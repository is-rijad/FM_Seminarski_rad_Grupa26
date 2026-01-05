const assert = require("assert");
const { expect } = require("chai");
const { elementLocator, getFirstVisibleChild, waitForLoadingToFinish, convertPriceStringToFloat } = require("../utils/elementUtil");
const { By, until, Key } = require("selenium-webdriver");

describe("Latest tests", function () {
    it("open latest, then load more twice and check count", async function () {
        const latestNavLink = await elementLocator(By.css("a[href='/latest']"));
        await latestNavLink.click();
        await waitForLoadingToFinish();

        const viewAllNavLink = await global.driver.findElements(By.css("a[href*='/view-all']"));
        await viewAllNavLink[0].click();
        await waitForLoadingToFinish();

        for (let i = 0; i < 2; i++) {
            const loadMoreButton = await getFirstVisibleChild(By.xpath("//*[contains(@class, 'loadMoreBtn')]"), true);
            await global.driver.executeScript("arguments[0].click();", loadMoreButton);
            await global.driver.sleep(1000); // Wait for new items to load
        }
        const itemsElement = await global.driver.findElements(By.xpath("//*[contains(@class, 'item-container')]/a"));
        assert.ok(itemsElement.length == 50, "Latest load more test passed");
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

    it("open latest, then open product with discount and check discount", async function () {
        const latestNavLink = await elementLocator(By.css("a[href='/latest']"));
        await latestNavLink.click();
        await waitForLoadingToFinish();

        const firstProductWithDiscount = await getFirstVisibleChild(By.xpath("//h2[normalize-space()='Najnoviji proizvodi na popustu']/parent::*/parent::*/div[last()]/div/div/div/div[1]/a"), true);
        await firstProductWithDiscount.click();
        await waitForLoadingToFinish();

        const priceElement = await elementLocator(By.xpath("//div[contains(@class, 'VariantHandler') and contains(@class, 'price')]"));

        const discountElement = await priceElement.findElement(By.xpath(".//span[contains(., '%')]")).getText();
        const discountValue = parseFloat(discountElement.replace('%', '').trim()).toFixed(2);

        const priceBeforeDiscountElement = await priceElement.findElement(By.xpath(".//div/p")).getText();
        const priceBeforeDiscountValue = convertPriceStringToFloat(priceBeforeDiscountElement);

        const discountedPriceElement = await priceElement.findElement(By.xpath(".//h2")).getText();

        const discountedPriceValue = convertPriceStringToFloat(discountedPriceElement);

        const expectedDiscountedPrice = (priceBeforeDiscountValue - (priceBeforeDiscountValue * (discountValue / 100)));

        expect(discountedPriceValue).to.be.closeTo(expectedDiscountedPrice, 0.05, "Discounted price should match the expected value after applying discount");
    });
});