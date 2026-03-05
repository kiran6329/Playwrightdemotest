import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly productsText: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator; 


  constructor(page: Page) {
    this.page = page;
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
   
    this.errorMessage = page.getByText('Epic sadface', { exact: false });
    this.productsText = page.getByText('Products');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async navigateToLoginPage() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async verifyTitle() {
    await expect(this.page).toHaveTitle('Swag Labs');
  }

  async loginToApplication(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
    await expect(this.page).toHaveURL(/inventory.html/);
  }
   
  

  ////new

    async navigate() {
    await this.page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
  }

  async login(username: string, password: string) {
    // Fill fields (clear first to be safe)
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    // open burger menu then click logout
    await this.menuButton.click();
    await this.logoutLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.productsText.isVisible();
  }

  async getErrorText(): Promise<string | null> {
    return await this.errorMessage.textContent().catch(() => null);
  }
}   