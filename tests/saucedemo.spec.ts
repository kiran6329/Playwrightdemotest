import {test, expect} from '@playwright/test';

test('verify page title' , async ({page}) =>{

await page.goto('https://www.saucedemo.com/');
const Title= await page.title();
 console.log('title is-',Title)

await expect(page).toHaveTitle('Swag Labs');

const login = page.getByRole('textbox', { name: 'Username' });
await login.fill('standard_user');

const password = page.getByRole('textbox', { name: 'Password' });
await password.fill('secret_sauce');

const submit = page.getByRole('button');
await submit.click();

const text =page.getByText('Sauce Labs Backpack', { exact: true });
console.log('text is-',text);
const saucelabclick = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
await saucelabclick.click();

})

// test ('verify login', async({page})=>{

// const login = page.getByRole('textbox',{ name: 'user-name' });
// await login.fill('standard_user');

// const password = page.getByRole('textbox', {name: 'password'});
// await password.fill('secret_sauce');

// const submit = page.getByRole('button',{name:'login-button'});
// await submit.click();


// })


// test('verify loggedin',async ({page})=>{



// })

// test ('verify click on cart',async({page})=>{



// })
