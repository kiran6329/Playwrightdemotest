import { Page } from '@playwright/test';

export class ContactsPage {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createContact(firstName: string, lastName: string) {

    await this.page.getByRole('button', { name: 'Add a New Contact' }).click();

    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);

    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
  async reloadPage() {
    await this.page.reload();
  }
   async waitForContactsApi(urlpart:string) {

    const response = await this.page.waitForResponse(resp =>
      resp.url().includes(urlpart) &&
      resp.request().method() === 'GET' && resp.status()===200 &&
      resp.headers()['content-type']?.includes('application/json'),{timeout:30000}
    );
    return await response.json();
  }
  async getUIContacts() {

    const contacts = await this.page.locator('tr td:nth-child(2)').allTextContents();
    return contacts.map(c => c.trim());;
  }

}