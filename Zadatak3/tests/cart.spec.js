const assert = require("assert");
const { expect } = require("chai");
const config = require("../config/config");
const { elementLocator, getFirstVisibleChild, waitForLoadingToFinish, convertPriceStringToFloat, convertDeliveryPriceStringToFloat } = require("../utils/elementUtil");
const { By, until } = require("selenium-webdriver");
const { searchAndOpenItem } = require("../utils/testUtil");

describe("Cart tests", function () {
    it("search for an item and add 3 of them to cart", async function () {
        await searchAndOpenItem("cipela");

        let priceElement = await getFirstVisibleChild(By.xpath("//*[contains(@class,'VariantHandler') and contains(@class,'price')]//h2"), false, 5);
        const priceValue = convertPriceStringToFloat(await priceElement.getText());
        assert.ok(priceValue > 0, "Price is not greater than zero");

        const addToCartButton = await elementLocator(By.xpath("//*[contains(@class,'Button-module') and contains(@class,'bazarBtn')]"));
        await addToCartButton.click();

        const goToCartButton = await elementLocator(By.css("a[href='/discover/checkout']"));
        await goToCartButton.click();

        await waitForLoadingToFinish();
        await global.driver.wait(
            until.elementLocated(By.xpath("//*[@data-value]")),
            config.timeout
        );
        const desiredQuantity = 3;
        let elements = await global.driver.findElements(By.xpath("//*[@data-value]"))

        const quantityInput = await elements[elements.length - 1].findElement(By.css('input'));
        await quantityInput.click();

        await global.driver.wait(
            until.elementLocated(By.xpath("//*[contains(@class,'menu')]")),
            config.timeout
        );

        const options = await global.driver.findElements(
            By.css('[class*="option"]')
        );

        await options[desiredQuantity - 1].click();

        await global.driver.sleep(1000); // Wait for quantity update to reflect

        elements = await global.driver.findElements(By.xpath("//*[contains(@class,'singleValue')]"));
        let deliveryPrice = convertDeliveryPriceStringToFloat(await elements[0].getText());
        assert.ok(deliveryPrice >= 0, "Delivery price is negative");

        const orderPriceElement = await elementLocator(By.xpath("//*[contains(@class,'Order-module') and contains(@class,'priceDetail')]/h3[last()]"));
        let orderPrice = convertPriceStringToFloat(await orderPriceElement.getText());
        const expectedTotalPrice = parseFloat((priceValue * desiredQuantity) + deliveryPrice);

        expect(orderPrice).to.be.closeTo(expectedTotalPrice, 0.05, "Total order price does not match expected value");
    });

    it("search for an item and add it to cart, then remove", async function () {
        await searchAndOpenItem("mantil");

        const addToCartButton = await elementLocator(By.xpath("//*[contains(@class,'Button-module') and contains(@class,'bazarBtn')]"));
        await addToCartButton.click();

        const goToCartButton = await elementLocator(By.css("a[href='/discover/checkout']"));
        await goToCartButton.click();

        await waitForLoadingToFinish();
        await global.driver.wait(
            until.elementLocated(By.xpath("//button[normalize-space()='Ukloniti']")),
            config.timeout
        );
        const removeItemButton = await elementLocator(By.xpath("//button[normalize-space()='Ukloniti']"));
        await removeItemButton.click();

        await global.driver.sleep(1000); // Wait for removal to process

        const cartBadge = await elementLocator(By.xpath("//a[@href='/discover/checkout']/following-sibling::*[1][contains(@class,'badge')]"));
        const cartBadgeText = await cartBadge.getText();
        assert.equal(cartBadgeText, "1", "Cart badge does not show 1 after removing the item");
    });
});