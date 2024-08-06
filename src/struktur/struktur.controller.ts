import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { StrukturService } from './struktur.service';
import { Struktur } from 'src/entities/struktur.entity';
import { CreateStrukturDto } from './dto/create-struktur.dto';
import { UpdateStrukturDto } from './dto/update-struktur.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';

@Controller('strukturs')
@ApiTags('strukturs')
export class StrukturController {
    constructor(private readonly strukturService: StrukturService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur')))
    @ApiOperation({ summary: 'Create a new Struktur' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'name', 'jabatan'], 
            properties: {
                name: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the Struktur',
                    example: 'John Doe',
                },
                jabatan: {
                    type: 'string',
                    format: 'text',
                    description: 'Position or role in the Struktur',
                    example: 'Head',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for Struktur photo',
                    example: 'photo.jpg',
                },
                alamat: {
                    type: 'string',
                    format: 'text',
                    description: 'Address of the Struktur',
                    example: '123 Street Name',
                },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturDto: CreateStrukturDto,
    ): Promise<Struktur> {
        const fotoSrc = getFileUrl('struktur', file);
        console.log(fotoSrc);

        return this.strukturService.create(createStrukturDto, fotoSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Strukturs' })
    @ApiResponse({ status: 200, description: 'Returns all Strukturs' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Struktur[], total: number }> {
        return this.strukturService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Struktur by ID' })
    @ApiParam({ name: 'id', description: 'Struktur ID' })
    @ApiResponse({ status: 200, description: 'Returns the Struktur' })
    async findOne(@Param('id') id: string): Promise<Struktur> {
        return this.strukturService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur')))
    @ApiOperation({ summary: 'Update a Struktur by ID' })
    @ApiParam({ name: 'id', description: 'Struktur ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the Struktur',
                    example: 'Jane Doe',
                },
                jabatan: {
                    type: 'string',
                    format: 'text',
                    description: 'Position or role in the Struktur',
                    example: 'Deputy Head',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for Struktur photo',
                    example: 'updated-photo.jpg',
                },
                alamat: {
                    type: 'string',
                    format: 'text',
                    description: 'Address of the Struktur',
                    example: '456 Another Street',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturDto: UpdateStrukturDto,
    ): Promise<Struktur> {
        const fotoSrc = getFileUrl('struktur', file);
        console.log(fotoSrc);

        return this.strukturService.update(id, updateStrukturDto, fotoSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Struktur by ID' })
    @ApiParam({ name: 'id', description: 'Struktur ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Struktur successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturService.remove(id);
    }
}
