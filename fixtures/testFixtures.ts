import { test as base } from '@playwright/test';
import { DataTablePage } from '../page/DataTablePage';

type MyFixtures = {
  dataTablePage: DataTablePage;
};      

export const test = base.extend<MyFixtures>({
  dataTablePage: async ({ page }, use) => {
    const p = new DataTablePage(page);
    await p.navigate();
    await use(p);
  }
});

export const expect = test.expect;