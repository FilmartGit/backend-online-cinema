import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FileService } from './file.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { FilesInterceptor } from '@nestjs/platform-express'

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // Загрузка файлов
  @Post('uploads')
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FilesInterceptor('file'))
  async saveFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string
  ) {
    return await this.fileService.saveFiles(files, folder)
  }

  
}
