import { test, expect } from '@playwright/test';

import { RegisterPage } from '../page/RegisterPageContact';
import { LoginPage } from '../page/LoginPageContact';
import { ContactsPage } from '../page/ContactsPage';
import data from '../test-data/data.json';

test('E2E UI + API Validation Scenario', async ({ page }) => {

  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const contactsPage = new ContactsPage(page);

  const email = `user${Date.now()}@test.com`;
  const password = data.user.password;

  const contact1 = data.contacts[0];
  const contact2 = data.contacts[1];

  let storedApiContacts: any;

  // 1 Register new user
  await registerPage.navigate();
  await registerPage.registerUser(
    data.user.firstName,
    data.user.lastName,
    email,
    password
  );

  // 2 Login
  await loginPage.navigate();
  await loginPage.login(email, password);

  // 3 Create two contacts
  await contactsPage.createContact(contact1.firstName, contact1.lastName);
  await contactsPage.createContact(contact2.firstName, contact2.lastName);
  await loginPage.logout();
  const apiContacts = await loginPage.loginafter(email, password);
  console.log("API Response:", apiContacts);



  

   // 4 Refresh page
  //await contactsPage.reloadPage();

//const responsePromise = contactsPage.waitForContactsApi('/contacts');

//await contactsPage.reloadPage();
 // await contactsPage.createContact(contact1.firstName, contact1.lastName);
 // await contactsPage.createContact(contact2.firstName, contact2.lastName);
 // const apiContacts = await responsePromise;


  // 5 Intercept contacts API
//  const apiContacts = await contactsPage.waitForContactsApi('contactList');


  // 6 Verify UI contacts match API
  
  const uiContacts = await contactsPage.getUIContacts();

  expect(uiContacts.length).toBe(apiContacts.length);

  // 7 Store API response
 // storedApiContacts = apiContacts;
storedApiContacts = apiContacts;
  // 8 Logout
  await loginPage.logout();

  // 9 Login again
  await loginPage.login(email, password);

  // 10 Verify contacts match stored data
  const apiContactsAfterLogin = await contactsPage.waitForContactsApi('contacts');

  expect(apiContactsAfterLogin).toEqual(storedApiContacts);

});