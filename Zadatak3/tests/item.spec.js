const assert = require("assert");
const { elementLocator, waitForLoadingToFinish, getFirstVisibleChild } = require("../utils/elementUtil");
const { By } = require("selenium-webdriver");
const { searchAndOpenItem } = require("../utils/testUtil");

describe("Item tests", function () {
    it("open item and add it to the wishlist", async function () {
        await searchAndOpenItem("vaga");

        const addToWishlistButton = await elementLocator(By.xpath("//*[contains(@class,'PaymentInfo') and contains(@class,'wishListBtn')]"));
        await addToWishlistButton.click();
        await global.driver.sleep(1000); // Wait for wishlist update to reflect

        const wishlistIcon = await elementLocator(By.css("a[href='/discover/wishlist']"));
        await wishlistIcon.click();
        await waitForLoadingToFinish();
        const wishlistItems = await global.driver.findElements(By.xpath("//*[contains(@class,'page-module') and contains(@class,'content')]//a"));

        // This is bug, as the item is not being added to wishlist
        assert.ok(wishlistItems.length > 0, "Wishlist should contain at least one item");
    });

    it("open category and open one item from it", async function () {
        const parentCategory = await global.driver.findElements(By.xpath("//*[contains(@class,'CategoryHeader') and contains(@class,'categoryItem')]//a"));
        await driver.executeScript(`
            const el = arguments[0];
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            `, parentCategory[0]);

        const category = await global.driver.findElements(By.xpath("//*[contains(@class,'CategoryHeader') and contains(@class,'subSubItem')]//a"));
        await category[0].click();
        await waitForLoadingToFinish();

        const categoryItems = await global.driver.findElements(By.xpath("//*[contains(@class,'item-container')]//a"));

        // This is bug, as the category sould not be empty
        assert.ok(categoryItems.length > 0, "Category should contain at least one item");
    });

    it("open tag and open one item from it", async function () {
        const tag = await getFirstVisibleChild(By.xpath("//*[contains(@class,'tagButton') and normalize-space()='tshirt']"));
        await tag.click();
        await waitForLoadingToFinish();

        const tagItems = await global.driver.findElements(By.xpath('//*[contains(@class,"item-container")]/a'));

        // This is bug, as the tag sould not be empty
        assert.ok(tagItems.length > 0, "Tag should contain at least one item");
    });
});