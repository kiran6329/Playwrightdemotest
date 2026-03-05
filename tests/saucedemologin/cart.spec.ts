import { test, expect  } from '@playwright/test';
import { LoginPage } from '../../page/LoginPage';
import { HomePage } from '../../page/Homepage';
import { CartPage } from '../../page/CartPage';

test('add Sauce Labs Backpack to cart then remove it', async ({ page }) => {
  
  const cart = new CartPage(page);
  const login = new LoginPage (page);
  const home = new HomePage(page);

  // 1) go to site and login (standard saucedemo test user)
  await login.navigate();

    await login.login('standard_user', 'secret_sauce');
   
 // Assert we reached inventory page
    await expect(page).toHaveURL(/inventory.html/);
    await expect(login.productsText).toBeVisible();


  // 2) add backpack to cart
   await home.addBackpackToCart();
  
  await home.verifyAddedwithqtyandrole('1','remove-sauce-labs-backpack')


  // 3) verify cart badge shows 1
  await cart.expectCartCount(1);


  // 4) open cart page
  await cart.openCart();

  // 5) verify the remove button (for the item) is visible on cart page
  await cart.expectRemoveButtonVisible();
 

  // 6) click remove
  await cart.removeItem();
  

  // 7) after removing, verify cart has no quantity badge AND item no longer present
  await cart.expectCartEmpty();
 
  await cart.expectItemNotInCart();
 
});