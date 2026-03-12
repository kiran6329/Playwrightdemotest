import { Page, Locator } from '@playwright/test';

export class DataTablePage {
  readonly page: Page;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator('#example'); // table root
  }

  // --- Page actions ---
  async navigate() {
    await this.page.goto('https://datatables.net/examples/basic_init/alt_pagination.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async search(term: string) {
    const searchInput = this.page.locator('input.dt-input');
    await searchInput.fill(term);
    await this.page.waitForTimeout(500);
  }

  async clearSearch() {
    const searchInput = this.page.locator('input.dt-input');
    await searchInput.fill('');
    await this.page.waitForTimeout(500);    
  }

  async setPageSize(size: number) {
    const pageSelect = this.page.locator('select.dt-input');
    await pageSelect.selectOption({ value: String(size) });
    await this.page.waitForTimeout(500);
  }

  // --- Table actions ---
  async getRows() {
    return this.table.locator('tbody tr');
  }

  async getRowCount() {
    return (await this.getRows()).count();
  }

  async getColumnValues(columnIndex: number) {
    const rows = await this.getRows();
    const values: string[] = [];
    for (let i = 0; i < await rows.count(); i++) {
      const cell = rows.nth(i).locator(`td:nth-child(${columnIndex})`);
      values.push((await cell.textContent())?.trim() || '');
    }
    return values;
  }

  async sortByColumn(columnIndex: number) {
    const header = this.table.locator(`thead th:nth-child(${columnIndex})`);
    await header.click();
    await this.page.waitForTimeout(500);
  }

  async goToPage(pageNumber: number) {
    const pageBtn = this.page.getByRole('link', { name: String(pageNumber), exact: true });
    await pageBtn.click();
    await this.page.waitForTimeout(500);    
  }

  async goToNextPage() {
    const nextBtn = this.page.getByLabel('Next', { exact: true });
    await nextBtn.click();
    await this.page.waitForTimeout(500);
  }

  async goToPreviousPage() {
    const prevBtn = this.page.getByLabel('Previous', { exact: true });
    await prevBtn.click();
    await this.page.waitForTimeout(500);
  }

  async getCurrentPage() {
    return await this.page.locator('button.dt-paging-button.current').textContent();
  }
}