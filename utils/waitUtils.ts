import { Locator } from '@playwright/test';

export async function waitForTableLoad(rootLocator: Locator, timeout = 5000) {
  // Wait until tbody row appears (attached) or table visible
  await Promise.race([
    rootLocator.locator('tbody tr').first().waitFor({ state: 'attached', timeout }).catch(() => {}),
    rootLocator.waitFor({ state: 'visible', timeout }).catch(() => {})
  ]);
  // Wait for any processing overlay to hide (common in DataTables)
  const processing = rootLocator.page().locator('.dataTables_processing');
  if (await processing.count() > 0) {
    await processing.waitFor({ state: 'hidden', timeout }).catch(() => {});
  }
}

export async function waitForPaginationUpdate(rootLocator: Locator, timeout = 5000) {
  await rootLocator.page().locator('.dataTables_paginate').waitFor({ state: 'visible', timeout });
}