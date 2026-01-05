const { Builder } = require("selenium-webdriver");
const config = require("./config");
require("chromedriver");

async function buildDriver() {
    return new Builder()
        .forBrowser(config.browser)
        .build();
}

async function openPage() {
    await global.driver.get(config.baseUrl);
    await global.driver.manage().window().maximize();
}

module.exports = {
    buildDriver,
    openPage
};