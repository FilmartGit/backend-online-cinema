import { BadRequestException, Injectable } from '@nestjs/common'
import { FileResponse } from './interface/file.interface'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'default'
  ): Promise<FileResponse[]> {
    const folderPath = `${path}/uploads/${folder}`
    await ensureDir(folderPath)

    if (!files) throw new BadRequestException('Файлы не переданы')

    const res: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        await writeFile(`${folderPath}/${file.originalname}`, file.buffer)

        return {
          url: `/uploads/${folder}/${file.originalname}`,
          name: file.originalname,
        }
      })
    )

    return res
  }
}
