import { test, expect } from '@playwright/test';

test("Verify Page Title",async ({page}) =>{

await page.goto('https://www.google.com/');   
let tle:String= await page.title();
console.log("Title:",tle);             
await expect(page).toHaveTitle("Google");


 })                     