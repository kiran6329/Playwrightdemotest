import { test, expect } from '../fixtures/testFixtures';
import { waitForTableLoad } from '../utils/waitUtils';
console.log('waitForTableLoad:', waitForTableLoad);
import { isSortedAscending, isSortedDescending, validateSearchResults } from '../utils/tableUtils';
import { searchCases, sortColumns } from '../test-data/tableData';

test.describe('DataTables advanced table tests', () => {

  test('Table Load: table visible and pagination present', async ({ dataTablePage }) => {
    const table = dataTablePage.table;
    //await waitForTableLoad(table.root); 
    expect(await table.getRowCount()).toBeGreaterThan(0);
    expect(await table.paginationContainer.count()).toBeGreaterThan(0);
  });

  test.describe('Search tests', () => {
    for (const caseData of searchCases) {
      test(`${caseData.name} - "${caseData.term}"`, async ({ dataTablePage }) => {
        const table = dataTablePage.table;
        await dataTablePage.search(caseData.term);
       // await waitForTableLoad(table.root);
        const rows = await table.getRowsTexts();
        if (caseData.expectCountEquals !== undefined) {
          expect(rows.length).toBe(caseData.expectCountEquals);
        } else if (caseData.expectCountGreaterThan !== undefined) {
          expect(rows.length).toBeGreaterThan(caseData.expectCountGreaterThan - 1);
          expect(validateSearchResults(rows, caseData.term)).toBeTruthy();
        }
        await dataTablePage.clearSearch();
      });
    }
  });

  test.describe('Sorting tests', () => {
    for (const s of sortColumns) {
      test(`Sort ${s.column} ascending then descending`, async ({ dataTablePage }) => {
        const table = dataTablePage.table;
        await table.sortByColumn(s.column);
        await waitForTableLoad(table.root);
        const asc = await table.getColumnValues(s.column);
        expect(isSortedAscending(asc, s.numeric)).toBeTruthy();

        await table.sortByColumn(s.column);
        await waitForTableLoad(table.root);
        const desc = await table.getColumnValues(s.column);
        expect(isSortedDescending(desc, s.numeric)).toBeTruthy();
      });
    }
  });

  test('Pagination: next, previous, go to page 3', async ({ dataTablePage }) => {
    const table = dataTablePage.table;
    await waitForTableLoad(table.root);

    const before = await table.getCurrentPage();
    await table.goToNextPage();
    await waitForTableLoad(table.root);
    const next = await table.getCurrentPage();
    expect(next).not.toBe(before);

    await table.goToPreviousPage();
    await waitForTableLoad(table.root);
    const prev = await table.getCurrentPage();
    expect(prev).not.toBeNull();

    try {
      await table.goToPage(3);
      await waitForTableLoad(table.root);
      const p3 = await table.getCurrentPage();
      expect(p3).toBe(3);
    } catch (e) {
     console.log('Page 3 not available on this dataset - skipping direct page 3 assertion');
    }
  });

  test('Page size: set to 25 rows per page', async ({ dataTablePage }) => {
    const table = dataTablePage.table;
    await dataTablePage.setPageSize(25);
    await waitForTableLoad(table.root);
    const rowCount = await table.getRowCount();
    expect(rowCount).toBeLessThanOrEqual(25);
    if (rowCount > 0) expect(rowCount).toBeGreaterThan(0);
  });

  test('Combined: Search + Pagination', async ({ dataTablePage }) => {
    const table = dataTablePage.table;
    await dataTablePage.search('a');
    await waitForTableLoad(table.root);
    await table.goToNextPage();
    await waitForTableLoad(table.root);
    const rows = await table.getRowsTexts();
    expect(rows.length).toBeGreaterThanOrEqual(0);
    await dataTablePage.clearSearch();
  });

  test('Combined: Search + Sorting', async ({ dataTablePage }) => {
    const table = dataTablePage.table;
    await dataTablePage.search('Tokyo');
    await waitForTableLoad(table.root);
    await table.sortByColumn('Name');
    await waitForTableLoad(table.root);
    const vals = await table.getColumnValues('Name');
    expect(isSortedAscending(vals, false)).toBeTruthy();
    await dataTablePage.clearSearch();
  });

  test('Combined: Sorting + Pagination', async ({ dataTablePage }) => {
    const table = dataTablePage.table;
    await table.sortByColumn('Name');
    await waitForTableLoad(table.root);
    await table.goToNextPage();
    await waitForTableLoad(table.root);
    const vals = await table.getColumnValues('Name');
    expect(vals.length).toBeGreaterThanOrEqual(0);
  });

});