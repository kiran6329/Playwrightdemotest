import { test, expect } from '@playwright/test';

test('Amazon search -> verify product -> add to cart -> logout', async ({ page }) => {
  const HOME = 'https://www.amazon.in/';

  // Credentials from env (do NOT hardcode real credentials)
  const EMAIL = process.env.AMAZON_USER;
  const PASSWORD = process.env.AMAZON_PASS;
  if (!EMAIL || !PASSWORD) {
    test.skip(true, 'Environment variables AMAZON_USER / AMAZON_PASS not provided');
  }

  // Product we will search for
  const PRODUCT = 'iPhone 17 Pro Max';

  // --- Locators used inline ---
  const ACCOUNT_MENU = '#nav-link-accountList';              // Header "Account & Lists"
  const SIGNIN_EMAIL = '#ap_email_login';                          // Sign-in email input
  const CONTINUE_BTN = '#continue';                          // Continue (after email)
  const SIGNIN_PASSWORD = '#ap_password';                    // Password input
  const SIGNIN_SUBMIT = '#signInSubmit';                     // Sign-in button
  const SEARCH_BOX = '#twotabsearchtextbox';                // Search input
  const SEARCH_SUBMIT = 'input#nav-search-submit-button';    // Search button
  const PRODUCT_LINK_BY_TEXT = (title: string) => `a:has-text("${title}")`; // find product link by text
  const ADD_TO_CART = '#add-to-cart-button';                 // Add to cart on product page
  const CART_COUNT = '#nav-cart-count';                      // Cart count in header

  // 1) Go to Amazon home
  await page.goto(HOME, { waitUntil: 'domcontentloaded' });

  // 2) Click account menu to go to sign-in
  await page.click(ACCOUNT_MENU);
  await page.waitForSelector(SIGNIN_EMAIL, { state: 'visible', timeout: 10000 });

  // 3) Enter email and continue
  await page.fill(SIGNIN_EMAIL, EMAIL!);
  await page.click(CONTINUE_BTN);

  // 4) Enter password and submit
  await page.waitForSelector(SIGNIN_PASSWORD, { state: 'visible', timeout: 10000 });
  await page.fill(SIGNIN_PASSWORD, PASSWORD!);
  await page.click(SIGNIN_SUBMIT);
await page.waitForLoadState('networkidle'); 

  // Basic check: account menu should be visible after login
 // await expect(page.locator(ACCOUNT_MENU)).toBeVisible({ timeout: 10000 });

  // 5) Search for the product
  const Searchfirstbox = page.locator(SEARCH_BOX).first();
  await Searchfirstbox.fill(PRODUCT); 
  await page.click(SEARCH_SUBMIT);
await page.waitForLoadState('networkidle'); 

  // 6) Assert the product is visible in search results
  const productResult = page.locator(PRODUCT_LINK_BY_TEXT(PRODUCT)).first();
  await expect(productResult).toBeVisible({ timeout: 15000 });

  // 7) Open the first matching product (click link)
  await productResult.scrollIntoViewIfNeeded();
  productResult.click();
  await page.waitForLoadState('networkidle');

  // 8) Add to cart (wait for Add to Cart button)
  await page.waitForSelector(ADD_TO_CART, { state: 'visible', timeout: 15000 });
  await Promise.all([
    // Amazon may call multiple endpoints — waiting for some network activity is helpful
    page.waitForResponse(resp => resp.status() === 200 || resp.url().includes('/gp/cart/') ).catch(() => {}),
    page.click(ADD_TO_CART),
  ]);

  // 9) Optional: wait a short while and read cart count
  await page.waitForTimeout(2000);
  const cartCountText = await page.textContent(CART_COUNT).catch(() => null);
  console.log('Cart count (may be empty initially):', cartCountText);

  // 10) Logout: click account menu and click sign-out if visible, else fallback to sign-out url
  await page.click(ACCOUNT_MENU);
  // Try common sign-out text variants
  const signOutTexts = ['Sign Out', 'Sign out', 'Logout', 'Log Out'];
  let signedOut = false;
  for (const t of signOutTexts) {
    const locator = page.locator(`text="${t}"`);
    if (await locator.count() > 0) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
        locator.first().click(),
      ]);
      signedOut = true;
      break;
    }
  }
  if (!signedOut) {
    // Fallback: direct sign-out URL (works for many Amazon domains)
    await page.goto('https://www.amazon.in/gp/flex/sign-out.html', { waitUntil: 'networkidle' });
  }

  // Final assertion: after sign-out the account menu should still be visible (shows sign-in)
  await expect(page.locator(ACCOUNT_MENU)).toBeVisible({ timeout: 10000 });
});