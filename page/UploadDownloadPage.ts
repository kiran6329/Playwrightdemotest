import { Page, expect } from '@playwright/test';

export class UploadDownloadPage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators using Playwright built-in locators
    uploadInput = () => this.page.locator('#uploadFile');
    uploadedFilePath = () => this.page.locator('#uploadedFilePath');
    downloadButton = () => this.page.getByRole('button', { name: 'Download' });

    async navigate() {
        await this.page.goto('https://demoqa.com/upload-download');
    }

    async uploadFile(filePath: string) {
        await this.uploadInput().setInputFiles(filePath);
    }

    async verifyUploadedFileName(fileName: string) {
        await expect(this.uploadedFilePath()).toContainText(fileName);
    }

    async clickDownload() {
        return await this.page.waitForEvent('download');
    }
    
    async downloadFile() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadButton().click();
    return await downloadPromise;
}
}