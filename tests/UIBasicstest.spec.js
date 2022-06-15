const {test,expect} = require('@playwright/test');
// const { expect } = require('../playwright.config');

test('Browser context Playwright test', async ({browser})=>{
    //chrome
   
    
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');
    
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");
    // const cardTitles = page.locator(".card-body a");

    console.log(await page.title());
    await userName.type("rahulshetty");
    await page.locator("[type='password']").type("learning");
    await signIn.click();
    console.log(await page.locator("[style*='block']").textContent()); // for partial match attribute*=value
    await expect(page.locator("[style*='block']")).toContainText('Incorrect')
    //type , fill input on the page
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    // await page.waitForNavigation();
    // await signIn.click();
    //race condition
    await Promise.all(
        [
            page.waitForNavigation(),
            signIn.click(),
        ]
    );
    // console.log(await cardTitles.first().textContent());
    // console.log(await cardTitles.nth(1).textContent());
    const cardTitles = page.locator(".card-body a");
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
        
});

test('UI Controls', async ({page})=>{
    await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/');    
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");
    const documentLink = page.locator("[href*='documents-request']");
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption('consult');
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute("class","blinkingText");
    // New child window
    // await page.pause()

});

test('Child Window handling', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();    
    await page.goto('https://www.rahulshettyacademy.com/loginpagePractise/'); 
    const documentLink = page.locator("[href*='documents-request']");
    
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentLink.click(),
    ]);
    const text = await newPage.locator(".red").textContent();
    console.log(text);
    const arrayText =  text.split("@")
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await page.locator("#username").type(domain);
    console.log(await page.locator("#username").textContent());
});

// To run --> npx playwright test --headed
// To debug --> npx playwright test tests/UIBasicstest.spec.js --debug
// To run --> npx playwright codegen https://google.com  // to record playback