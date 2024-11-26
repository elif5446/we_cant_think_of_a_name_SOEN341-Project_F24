import { By, Builder, Actions } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import chromedriver from "chromedriver"

(async function auto_test() {
    let driver

    try {
        const service = new chrome.ServiceBuilder(chromedriver.path)
        driver = await new Builder().forBrowser("chrome").setChromeService(service).build()
        await driver.manage().window().maximize()
        await driver.manage().setTimeouts({implicit: 10000})
        await driver.get("http://localhost:3001")

        let buttons = await driver.findElements(By.tagName("button"))

        // create account (student) test
        // const create_account_button = buttons[2]
        // await create_account_button.click()
        
        // const email_field = await driver.findElement(By.id("email"))
        // await email_field.sendKeys("test_user@gmail.com")
        // const password_field = await driver.findElement(By.id("password"))
        // await password_field.sendKeys("pizza")
        // const first_name_field = await driver.findElement(By.id("firstname"))
        // await first_name_field.sendKeys("Test")
        // const last_name_field = await driver.findElement(By.id("lastname"))
        // await last_name_field.sendKeys("User")
        // const type_field = await driver.findElement(By.id("usertype"))
        // await type_field.click()
        // const student_option = await driver.findElement(By.xpath("//option[@value='student']"))
        // await student_option.click()

        // const signin_button = await driver.findElement(By.className("signin"))
        // await signin_button.click()

        // login (instructor) test
        await driver.get("http://localhost:3001")
        buttons = await driver.findElements(By.tagName("button"))
        const login_instructor_button = buttons[0]
        await login_instructor_button.click()

        const email_field = await driver.findElement(By.id("email"))
        await email_field.sendKeys("pizza@gmail.com")
        const password_field = await driver.findElement(By.id("password"))
        await password_field.sendKeys("pizza")

        const login_button = await driver.findElement(By.className("login"))
        await login_button.click()

        // instructor commenting test
        const links = await driver.findElements(By.className("assessment-link"))
        const link = links[1]
        await link.click()

        const students = await driver.findElements(By.className("student-card"))
        const student = students[1].findElement(By.className("details-toggle"))
        await student.click()
        
        const overlay = students[1].findElement(By.className("feedback-overlay"))
        const actions = driver.actions({async: true})
        await actions.move({origin: overlay}).perform()
    } catch (e) {
        console.log(e)
    } finally {
        // await driver.quit()
    }
}());