import { Controller, Get, Post, Body, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Photo } from 'src/entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';

@Controller('photos')
@ApiTags('photos')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('photos')))
    @ApiOperation({ summary: 'Create a new Photo' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'title'], 
            properties: {
                title: {
                    type: 'string',
                    format: 'text',
                    description: 'Title of the photo',
                    example: 'title',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for photo image',
                    example: 'file.jpg',
                },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createPhotoDto: CreatePhotoDto,
    ): Promise<Photo> {
        const photoSrc = getFileUrl('photos', file);
        return this.photoService.create(createPhotoDto, photoSrc);
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
