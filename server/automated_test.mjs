import { By, Builder } from "selenium-webdriver"

(async function auto_test() {
    let driver

    try {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize()
        await driver.get("http://localhost:3001")
    } catch (e) {
        console.log(e)
        await driver.quit()
    }
}())