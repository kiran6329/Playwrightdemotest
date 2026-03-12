import { Page, Locator } from '@playwright/test';

export class TableComponent {
  readonly page: Page;
  readonly root: Locator;
  readonly headerCells: Locator;
  readonly rows: Locator;
  readonly paginationContainer: Locator;
  readonly nextBtn: Locator;
  readonly prevBtn: Locator;
  readonly pageButtons: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
    this.headerCells = this.root.locator('thead th');
    this.rows = this.root.locator('tbody tr');
    this.paginationContainer = page.locator('.dataTables_paginate');
    this.nextBtn = page.locator('#example_next');
    this.prevBtn = page.locator('#example_previous');
    this.pageButtons = page.locator('.dataTables_paginate a, .paginate_button');
  }

  async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  async getRowsTexts(): Promise<string[][]> {
    const rowCount = await this.getRowCount();
    const result: string[][] = [];
    for (let i = 0; i < rowCount; i++) {
      const cells = this.rows.nth(i).locator('td');
      const cellCount = await cells.count();
      const row: string[] = [];
      for (let c = 0; c < cellCount; c++) {
        row.push((await cells.nth(c).innerText()).trim());
      }
      result.push(row);
    }
    return result;
  }

  async getColumnIndex(columnName: string): Promise<number> {
    const count = await this.headerCells.count();
    for (let i = 0; i < count; i++) {
      const text = (await this.headerCells.nth(i).innerText()).trim();
      if (text.toLowerCase() === columnName.toLowerCase()) return i;
    }
    throw new Error(`Column "${columnName}" not found`);
  }

  async getColumnValues(columnName: string): Promise<string[]> {
    const idx = await this.getColumnIndex(columnName);
    const rows = await this.getRowCount();
    const values: string[] = [];
    for (let r = 0; r < rows; r++) {
      const cell = this.rows.nth(r).locator('td').nth(idx);
      values.push((await cell.innerText()).trim());
    }
    return values;
  }

  async sortByColumn(columnName: string) {
    const idx = await this.getColumnIndex(columnName);
    await this.headerCells.nth(idx).click();
  }

  async goToNextPage() {
    await this.nextBtn.click();
  }

  async goToPreviousPage() {
    await this.prevBtn.click();
  }

  async goToPage(pageNumber: number) {
    const count = await this.pageButtons.count();
    for (let i = 0; i < count; i++) {
      const txt = (await this.pageButtons.nth(i).innerText()).trim();
      if (txt === String(pageNumber)) {
        await this.pageButtons.nth(i).click();
        return;
      }
    }
    throw new Error(`Page button ${pageNumber} not found`);
  }

  async getCurrentPage(): Promise<number | null> {
    const active = this.paginationContainer.locator('.paginate_button.current, .paginate_button.active, a.current, a.active');
    if ((await active.count()) > 0) {
      const txt = (await active.first().innerText()).trim();
      const n = Number(txt);
      return Number.isFinite(n) ? n : null;
    }
    // fallback
    for (let i = 0; i < await this.pageButtons.count(); i++) {
      const el = this.pageButtons.nth(i);
      const classAttr = (await el.getAttribute('class')) || '';
      if (classAttr.includes('active') || classAttr.includes('current')) {
        const txt = (await el.innerText()).trim();
        return Number(txt);
      }
    }
    return null;
  }
}