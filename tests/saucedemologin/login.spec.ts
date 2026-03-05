import { test, expect  } from '@playwright/test';
import { LoginPage } from '../../page/LoginPage';
import { HomePage } from '../../page/Homepage';
// test('verify login', async ({ page }) => {

//   const loginPage = new LoginPage(page);

//   await loginPage.navigateToLoginPage();

//   const title = await page.title();
//   console.log('Title is -', title);

//   await loginPage.verifyTitle();

//   await loginPage.loginToApplication('standard_user', 'secret_sauce');
// ///new

  
// });
test.describe('Sauce Demo - Login Scenarios (POM)', () => {
  test('Login with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login('standard_user', 'secret_sauce');

    // Assert we reached inventory page
    await expect(page).toHaveURL(/inventory.html/);
    await expect(login.productsText).toBeVisible();
  });

  test('Invalid username', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login('invalid_user', 'secret_sauce');

    const err = await login.getErrorText();
    expect(err).toBeTruthy();
    expect(err!.toLowerCase()).toContain('epic sadface');
  });

  test('Invalid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login('standard_user', 'wrong_password');

    const err = await login.getErrorText();
    expect(err).toBeTruthy();
    expect(err!.toLowerCase()).toContain('epic sadface');
  });

  test('Blank username and password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    // submit empty fields
    await login.login('', '');

    const err = await login.getErrorText();
    expect(err).toBeTruthy();
    // Saucedemo typically requires username first
    expect(err!.toLowerCase()).toContain('username');
  });

  test('Back button after successful login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);
    await expect(login.productsText).toBeVisible();

    // Navigate back, then check whether user remains logged in (best-effort)
    await page.goBack();
    // Wait a moment for any redirect / reload
    await page.waitForLoadState('networkidle');

    // Best-effort: verify inventory is still shown (session persisted)
    const stillLoggedIn = await login.isLoggedIn();
    expect(stillLoggedIn).toBeTruthy();
  });

  test('Refresh page after successful login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);

    // Reload and assert still on inventory
    await page.reload({ waitUntil: 'networkidle' });
    expect(await login.isLoggedIn()).toBeTruthy();
  });

  test('Account locked after multiple attempts', async ({ page }) => {
    const login = new LoginPage(page);
    await login.navigate();

    // saucedemo has a known locked account: 'locked_out_user'
    await login.login('locked_out_user', 'secret_sauce');

    const err = await login.getErrorText();
    expect(err).toBeTruthy();
    expect(err!.toLowerCase()).toContain('locked');
  });

  test('Multiple browser login with same user', async ({ browser }) => {
    // create two independent browser contexts (isolated sessions)
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    const lpa = new LoginPage(pageA);

    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    const lpb = new LoginPage(pageB);

    // login both contexts
    await lpa.navigate();
    await lpb.navigate();

    await lpa.login('standard_user', 'secret_sauce');
    await lpb.login('standard_user', 'secret_sauce');

    // assert both logged-in sessions
    await expect(pageA).toHaveURL(/inventory.html/);
    await expect(pageB).toHaveURL(/inventory.html/);
    expect(await lpa.isLoggedIn()).toBeTruthy();
    expect(await lpb.isLoggedIn()).toBeTruthy();

    // cleanup
    await contextA.close();
    await contextB.close();
  });

  test('Concurrent login validation (Simultaneous login attempt)', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const p1 = await context1.newPage();
    const p2 = await context2.newPage();

    const lp1 = new LoginPage(p1);
    const lp2 = new LoginPage(p2);

    await Promise.all([lp1.navigate(), lp2.navigate()]);

    // Attempt to login simultaneously
    await Promise.all([
      lp1.login('standard_user', 'secret_sauce'),
      lp2.login('standard_user', 'secret_sauce'),
    ]);

    // both should be able to login for this demo site
    await expect(p1).toHaveURL(/inventory.html/);
    await expect(p2).toHaveURL(/inventory.html/);

    await context1.close();
    await context2.close();


  });

    test('Click on Add to cart and verify QTY AND Remove Button', async ({ page }) => {
   
    const login = new LoginPage(page);
    const home= new HomePage (page);
    await login.navigate();

    await login.login('standard_user', 'secret_sauce');

    // Assert we reached inventory page
    await expect(page).toHaveURL(/inventory.html/);
    await expect(login.productsText).toBeVisible();

   
    await home.addBackpackToCart();
    await home.verifyAddedwithqtyandrole('1','remove-sauce-labs-backpack')

    });

  });
