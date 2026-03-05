import { test, expect } from '@playwright/test';

test('verify login', async ({page})=>{

const link = "https://the-internet.herokuapp.com/login";

await page.goto(link);

await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');

await page.getByRole('textbox', { name: 'Password' }).fill('SuperSecretPassword!')

const submit= page.locator('.fa.fa-2x.fa-sign-in');
await submit.click();
await
page.waitForLoadState('networkidle');


})