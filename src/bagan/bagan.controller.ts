import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { BaganService } from './bagan.service';
import { Bagan } from 'src/entities/bagan.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';

@Controller('bagan')
@ApiTags('bagan')
export class BaganController {
    constructor(private readonly baganService: BaganService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('bagan')))
    @ApiOperation({ summary: 'Create a new Bagan entry' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for Bagan image',
                    example: 'file.jpg',
                },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Bagan> {
        const imgSrc = getFileUrl('bagan', file);
        return this.baganService.create(imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get the Bagan entry' })
    @ApiResponse({ status: 200, description: 'Returns the Bagan entry' })
    async find(): Promise<Bagan | undefined> {
        return this.baganService.find();
    }

    @Delete()
    @ApiOperation({ summary: 'Delete the Bagan entry' })
    @ApiResponse({ status: 204, description: 'Bagan entry successfully deleted' })
    async remove(): Promise<void> {
        return this.baganService.remove();
    }
}
