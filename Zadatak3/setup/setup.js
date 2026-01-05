const config = require("../config/config");
const { buildDriver, openPage } = require("../utils/driver");

console.log("SETUP FILE LOADED");

before(async function () {
    global.driver = await buildDriver();
    console.log("DRIVER INITIALIZED");
});

beforeEach(async function () {
    await openPage();
})

after(async function () {
    if (global.driver) {
        try {
            await global.driver.quit();
            console.log("DRIVER DISPOSED");
        } catch (err) {
            console.warn("Error while quitting driver (ignored):", err.message || err);
        }
    }
});
