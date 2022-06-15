const {test,expect,request} = require('@playwright/test');

const loginPayLoad = {userEmail: "1913.tarun@gmail.com", userPassword: "Pass@123"};
let token;

test.beforeAll(async()=>{
   const apiContext = await request.newContext();
   const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
   {data : loginPayLoad})
   //200/201/202..
   expect(loginResponse.ok()).toBeTruthy();
   const loginResponseJson = await loginResponse.json();
//    loginResponse.body  or loginResponse.headers ; loginResponse.status
   token = loginResponseJson.token;
   console.log(token);
});

// test.beforeEach(async()=>{

// });
//test 1, test 2, test 3
test('Clint App Login', async ({page})=>{
//Playwright can execute any javascript expression
    page.addInitScript(value => {
        window.localStorage.setItem('token',value)
    },token);
    // await page.goto("https://rahulshettyacademy.com/client");
    // await page.locator("#userEmail").fill(email);
    // await page.locator("#userPassword").type("Pass@123");
    // await page.locator("[value='Login']").click(); //attribute =value
    // await page.waitForLoadState('networkidle'); // for synchronization 

    await page.goto("https://rahulshettyacademy.com/client");
    const email = "1913.tarun@gmail.com";
    const productName = 'zara coat 3';
    const products = await page.locator(".card-body");

    await page.waitForSelector(".card-body b",{state : 'attached'});
    const title = await page.locator(".card-body b").allTextContents(); //. is for class, .card-body is parent tag and b is child tag
    console.log("Title :"+ title); // return all element text : array
    const count = await products.count();
    console.log("Count " + count);
    for(let i=0; i < count; ++i)
    {
        console.log(await products.nth(i).locator("b").textContent());
        if (await products.nth(i).locator("b").textContent() === productName){ // chaining locator
           //add to cart
           await products.nth(i).locator("text=  Add To Cart").click();
           console.log("Clicked Add to Cart");
           break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").type("Ind",{delay:100}); //type method use auto wait, no need to put wait mechanism
    const dropdown = await page.locator(".ta-results");
    await dropdown.waitFor();
    const optionCount = await dropdown.locator("button").count();
    for(let i=0; i < optionCount; ++i){
        let text =  await dropdown.locator("button").nth(i).textContent();
        if(text === ' India'){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    // await page.locator(".user__name [type='text']").textContent();
    await expect(page.locator(".user__name [type='text']")).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(' Thankyou for the order. ');
    const orderNumber = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log(orderNumber);
    
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator('tbody').waitFor();

    const rows = await page.locator("tbody tr");
    for(let i=0; i< await rows.count(); i++)
    {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if(orderNumber.includes(rowOrderId))
        {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderNumber.includes(orderIdDetails)).toBeTruthy();
    
    // await page.pause();        
});