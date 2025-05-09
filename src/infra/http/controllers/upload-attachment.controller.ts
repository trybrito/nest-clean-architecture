import {
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

const MAX_FILE_SIZE = 1024 * 1024 * 2 // 2mb

@Controller('/attachments')
export class UploadAttachmentController {
	// constructor(private uploadAttachment: UploadAttachmentUseCase) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async handle(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
					new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		console.log(file)
	}
}
