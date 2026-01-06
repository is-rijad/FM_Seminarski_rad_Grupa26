const assert = require("assert");
const config = require("../config/config");
const { elementLocator, getFirstVisibleChild, waitForLoadingToFinish } = require("../utils/elementUtil");
const { By } = require("selenium-webdriver");

async function navigateToLoginPage() {
    const userIcon = await elementLocator(By.xpath("//div/div[contains(@class,'AnimatedIcon') and contains(@class,'icon')]"));
    await userIcon.click();


    const loginButton = await elementLocator(By.css("a[href='/login']"));
    await loginButton.click();
    await waitForLoadingToFinish();
}

describe("User tests", function () {
    it("login with invalid credentials", async function () {
        await navigateToLoginPage();
        const userName = "abdullah.ahmetovic"
        const password = "password123"

        const usernameInput = await elementLocator(By.xpath("//input[@id='username']"));
        const passwordInput = await elementLocator(By.xpath("//input[@id='password']"));

        await usernameInput.sendKeys(userName);
        await passwordInput.sendKeys(password);

        const loginButton = await elementLocator(By.xpath("//button[@type='submit']"));
        await loginButton.click();

        const errorMessageElement = await getFirstVisibleChild(By.xpath("//*[contains(@class,'error') and contains(@class,'message')]"));
        const errorMessageText = await errorMessageElement.getText();

        assert.equal(errorMessageText, "Neispravan email ili lozinka.", "Error message does not match expected text");
    });

    it("login and check redirect", async function () {
        await navigateToLoginPage();
        const userName = "abdullah.ahmetovic"
        const password = "Sifra12345!"

        const usernameInput = await elementLocator(By.xpath("//input[@id='username']"));
        const passwordInput = await elementLocator(By.xpath("//input[@id='password']"));

        await usernameInput.sendKeys(userName);
        await passwordInput.sendKeys(password);

        const loginButton = await elementLocator(By.xpath("//button[@type='submit']"));
        await loginButton.click();
        await waitForLoadingToFinish();

        const currentUrl = await global.driver.getCurrentUrl();
        assert.equal(currentUrl, config.baseUrl + "select-profile", "User is not redirected to select profile page after login");
    });
});