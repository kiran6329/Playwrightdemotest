import { Page } from '@playwright/test';

export class RegisterPage {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/addUser');
  }

  async registerUser(firstName: string, lastName: string, email: string, password: string) {

    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);

    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}