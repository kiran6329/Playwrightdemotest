import { test, expect } from '@playwright/test';
import { DataTablePage } from '../page/DataTablePage1';
import { searchData } from '../test-data/tableData1';
import { isSortedAscending, isSortedDescending, validateSearchResults } from '../utils/util';

test.describe('DataTable Advanced Tests', () => {

  test('Table Load Test', async ({ page }) => {
    const dtPage = new DataTablePage(page);
    await dtPage.navigate();
    expect(await dtPage.getRowCount()).toBeGreaterThan(0);
    expect( await page.locator('.dt-paging-button')).toHaveCount(8);
  });

  test.describe('Search Tests', () => {
    for (const data of searchData) {
      test(`Search - ${data.type} - ${data.term}`, async ({ page }) => {
        const dtPage = new DataTablePage(page);
        await dtPage.navigate();
        await dtPage.search(data.term);
        const values = await dtPage.getColumnValues(1);
        expect(validateSearchResults(values, data.term)).toBeTruthy();
        expect(await dtPage.getRowCount()).toBe(data.expectedCount);
        await dtPage.clearSearch();
      });
    }
  });

  test('Sorting Test', async ({ page }) => {
    const dtPage = new DataTablePage(page);
    await dtPage.navigate();
    await dtPage.setPageSize(100);
    // Sort Name Asc
    await dtPage.sortByColumn(2);
    let values = await dtPage.getColumnValues(2);
    expect(isSortedAscending(values)).toBeTruthy();

    // Sort Name Desc
    await dtPage.sortByColumn(1);
    await dtPage.sortByColumn(1);
    values = await dtPage.getColumnValues(1);
    expect(isSortedDescending(values)).toBeTruthy();
  });

  test('Pagination Test', async ({ page }) => {
    const dtPage = new DataTablePage(page);
    await dtPage.navigate();
    await dtPage.goToNextPage();
    expect(await dtPage.getCurrentPage()).toBe('2');
    await dtPage.goToPreviousPage();
    expect(await dtPage.getCurrentPage()).toBe('1');
    await dtPage.goToPage(3);
    expect(await dtPage.getCurrentPage()).toBe('3');
  });

  test('Page Size Test', async ({ page }) => {
    const dtPage = new DataTablePage(page);
    await dtPage.navigate();
    await dtPage.setPageSize(25);
    expect(await dtPage.getRowCount()).toBe(25);
  });

  test('Combined Scenario - Search + Pagination', async ({ page }) => {
    const dtPage = new DataTablePage(page);
    await dtPage.navigate();
    await dtPage.search('3');
    await dtPage.goToNextPage();
    expect(await dtPage.getCurrentPage()).toBe('2');
    await dtPage.clearSearch();
  });

});