import { test, expect } from '@playwright/test';
import path from 'path';
import { UploadDownloadPage } from '../page/UploadDownloadPage';
import { FileUtils } from '../utils/fileUtils';
import { TestData } from '../test-data/fileTestData.ts';

test.describe('Upload Download Tests', () => {

    test('Upload file and verify filename', async ({ page }) => {

        const uploadPage = new UploadDownloadPage(page);

        await uploadPage.navigate();

        await uploadPage.uploadFile(TestData.uploadFilePath);

        await uploadPage.verifyUploadedFileName(TestData.uploadFileName);

    });

   test('Download file and verify existence', async ({ page }) => {

    const uploadPage = new UploadDownloadPage(page);

    await uploadPage.navigate();

    const download = await uploadPage.downloadFile();

    const downloadPath = path.join('downloads', download.suggestedFilename());
     console.log('Downloaded file path is-', downloadPath);
    await download.saveAs(downloadPath);

    expect(FileUtils.fileExists(downloadPath)).toBeTruthy();

    // Cleanup
    FileUtils.deleteFile(downloadPath);

});

});