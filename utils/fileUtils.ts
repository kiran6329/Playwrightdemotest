import fs from 'fs';


export class FileUtils {

    static fileExists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    static deleteFile(filePath: string) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

}