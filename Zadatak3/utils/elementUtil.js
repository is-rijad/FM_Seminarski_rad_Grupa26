const config = require("../config/config");
const { By, until } = require("selenium-webdriver");

async function elementLocator(locator, scrollIntoView = false) {
    let element = await global.driver.wait(
        until.elementLocated(locator),
        config.timeout
    );
    if (scrollIntoView) {
        await global.driver.executeScript(
            "arguments[0].scrollIntoView(true);",
            element
        );
    }
    await global.driver.wait(
        until.elementIsVisible(element),
        config.timeout
    );
    return await global.driver.findElement(locator);
}

async function getFirstVisibleChild(selector, scrollIntoView = false, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            console.error(`Attempt ${i + 1} to find visible child for selector: ${selector}`);
            return await elementLocator(selector, scrollIntoView);
        } catch (e) {
            if (e.name.includes("StaleElementReferenceError")) {
                await global.driver.sleep(300);
            };
        }
    }
    throw new Error("Element not found after retries");
}

async function waitForLoadingToFinish(timeout = config.timeout) {
    const loader = By.css('#nprogress');

    try {
        const element = await global.driver.wait(
            until.elementLocated(loader),
            timeout
        );

        await global.driver.wait(
            until.stalenessOf(element),
            timeout,
            'Loading indicator did not disappear'
        );
    } catch {
    }
}

function convertPriceStringToFloat(priceString) {
    return parseFloat(priceString.substring(0, priceString.indexOf(' ')).replace(',', '.'));
}

function convertDeliveryPriceStringToFloat(priceString) {
    let splittedString = priceString.split(',');
    let deliveryPrice = splittedString
        .pop()
        .replace('KM', '')
        .trim();
    deliveryPrice = splittedString.pop() + '.' + deliveryPrice;
    return parseFloat(deliveryPrice);
}


module.exports = {
    elementLocator,
    getFirstVisibleChild,
    waitForLoadingToFinish,
    convertPriceStringToFloat,
    convertDeliveryPriceStringToFloat
};
