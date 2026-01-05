const { elementLocator, getFirstVisibleChild, waitForLoadingToFinish } = require("./elementUtil");
const { By } = require("selenium-webdriver");

async function searchAndOpenItem(itemName) {
    const searchInput = await elementLocator(By.xpath("//*[contains(@class,'SearchComponent') and contains(@class,'searchInput')]"));
    await searchInput.clear();
    await searchInput.sendKeys(itemName);

    await global.driver.sleep(1000); // Wait for search results to load

    const searchResult = await getFirstVisibleChild(By.xpath("//*[contains(@class,'SearchResultsMenu') and contains(@class,'wrapper')]/a[1]"));
    await searchResult.click();

    await waitForLoadingToFinish();
}

module.exports = {
    searchAndOpenItem
}