import { Page } from '@playwright/test';
import { ContactsPage } from './ContactsPage';

export class LoginPage {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/');
  }

  async login(email: string, password: string) {

    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
 
async loginafter(email: string, password: string) {

  await this.page.getByPlaceholder('Email').fill(email);
  await this.page.getByPlaceholder('Password').fill(password);

  const [response] = await Promise.all([
    this.page.waitForResponse(resp =>
      resp.url().includes('contacts') &&
      resp.request().method() === 'GET' &&
      resp.status() === 200
    ),
    this.page.getByRole('button', { name: 'Submit' }).click()
  ]);

  const data = await response.json();
  return data;
}
  

  async logout() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }
}