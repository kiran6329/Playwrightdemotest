import { Page, Locator } from '@playwright/test';
import { TableComponent } from '../components/TableComponent';

export class DataTablePage {
  readonly page: Page;
  readonly url = 'https://datatables.net/examples/basic_init/alt_pagination.html';
  readonly tableRoot: Locator;
  readonly searchInput: Locator;
  readonly pageSizeSelect: Locator;
  readonly table: TableComponent;

  constructor(page: Page) {
    this.page = page;
    this.tableRoot = this.page.locator('table.dataTable');                        // table root
    // DataTables search field:
    this.searchInput = this.page.locator('input[type="search"]');          // global search input
    // Rows-per-page select is named <tableId>_length:
    this.pageSizeSelect = this.page.getByLabel('entries per page', { exact: true });
    this.table = new TableComponent(this.page, this.tableRoot);
  }

  async navigate() {
    await this.page.goto(this.url);
    await this.tableRoot.waitFor({ state: 'visible' });
    return this;
  }

  async search(term: string) {
    await this.searchInput.fill(''); // clear first
    await this.searchInput.fill(term);
    return this;
  }

  async clearSearch() {
    await this.searchInput.fill('');
    return this;
  }

  async setPageSize(size: number) {
    await this.pageSizeSelect.selectOption(String(size));
    return this;
  }
}