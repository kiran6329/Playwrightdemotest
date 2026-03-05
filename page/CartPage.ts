import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    
    readonly page: Page;
    readonly backpacktext: Locator;
    readonly removebutton:Locator;
    readonly carttext:Locator;

  constructor(  page: Page) {
   this.page = page;
   this.backpacktext=page.getByText('Sauce Labs Backpack', { exact: true });
   this.removebutton=page.getByRole('button', { name: 'Remove' });
   this.carttext=page.locator('[data-test="shopping-cart-link"]');

  }

  // locator for the small numeric badge shown on saucedemo
  cartBadge() {
    return this.page.locator('.shopping_cart_badge');
  }

  async expectCartCount(expected: number | string) {
    const badge = this.cartBadge();
    // if expected is 0 we expect badge to not exist
    if (String(expected) === '0') {
      await expect(badge).toHaveCount(0);
    } else {
      await expect(badge).toHaveText(String(expected));
    }
  }

  async openCart() {
    await this.carttext.click();
  }

  async expectRemoveButtonVisible() {
    await expect(this.removebutton).toBeVisible();
  }

  async removeItem() {
    await this.removebutton.click();
  }

  async expectItemNotInCart() {
    // item should not be visible in cart
    await expect(this.backpacktext).not.toBeVisible();
  }

  async expectCartEmpty() {
    // verify no numeric badge (no quantity)
    await expect(this.cartBadge()).toHaveCount(0);
}

}