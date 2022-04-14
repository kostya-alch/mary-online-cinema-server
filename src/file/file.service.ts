import { FileResponse } from './interface/file.interface';
import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';
import { path } from 'app-root-path';

@Injectable()
export class FileService {
   // метод загрузки файлов
   async saveFiles(
      files: Express.Multer.File[],
      folder: string = 'default' // папка по умолчанию
   ): Promise<FileResponse[]> {
      const uploadFolder = `${path}/uploads/${folder}`;
      await ensureDir(uploadFolder);
      const res: FileResponse[] = await Promise.all(
         files.map(async (file) => {
            await writeFile(
               `${uploadFolder}/${file.originalname}`,
               file.buffer
            ); // мапим путь куда сохранится файл
            return {
               url: `/uploads/${folder}/${file.originalname}`,
               name: file.originalname,
            };
         })
      );
      return res;
   }
}
