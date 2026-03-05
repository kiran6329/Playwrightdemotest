import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  constructor( private page: Page) {}

  
    async addBackpackToCart() {
    // Click Add to cart for Sauce Labs Backpack
    await this.page.locator("//button[@id='add-to-cart-sauce-labs-backpack']").click();
  }

  async verifyAddedwithqtyandrole(qty: string, role:string) {
    // Verify Remove button is visible foukr the same product
    const removeButton = this.page.locator("//button[@id='"+role+"']")
    await expect(removeButton).toBeVisible();

    // Verify shopping cart value is 1
    const cartBadge = this.page.getByText(qty, { exact: true });
    await expect(cartBadge).toHaveText(qty);

  }

  
}