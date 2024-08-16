import { Controller, Get, Post, Body, Param, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Photo } from 'src/entities/photo.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrls } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';

@Controller('photos')
@ApiTags('photos')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('photos')))
    @ApiOperation({ summary: 'Create new Photos' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['files'],
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'File uploads for photo images',
                    example: ['file1.jpg', 'file2.jpg'],
                },
            },
        },
    })
    async create(
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<Photo[]> {
        const photoSrcs = getFileUrls('photos', files);
        return this.photoService.create(photoSrcs);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Photos' })
    @ApiResponse({ status: 200, description: 'Returns all Photos' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Photo[], total: number }> {
        return this.photoService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Photo by ID' })
    @ApiParam({ name: 'id', description: 'Photo ID' })
    @ApiResponse({ status: 200, description: 'Returns the Photo' })
    async findOne(@Param('id') id: string): Promise<Photo> {
        return this.photoService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Photo by ID' })
    @ApiParam({ name: 'id', description: 'Photo ID' })
    @ApiResponse({ status: 204, description: 'Photo successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.photoService.remove(id);
    }
}
