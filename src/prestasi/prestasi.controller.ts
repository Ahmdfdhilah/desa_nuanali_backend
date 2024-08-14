import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { PrestasiService } from './prestasi.service';
import { Prestasi } from 'src/entities/prestasi.entity';
import { CreatePrestasiDto } from './dto/create-prestasi.dto';
import { UpdatePrestasiDto } from './dto/update-prestasi.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';

@Controller('prestasi')
@ApiTags('prestasi')
export class PrestasiController {
    constructor(private readonly prestasiService: PrestasiService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('prestasi')))
    @ApiOperation({ summary: 'Create a new Prestasi' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'title'], 
            properties: {
                title: {
                    type: 'string',
                    format: 'text',
                    description: 'Title of the prestasi',
                    example: 'Achievement Title',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for prestasi image',
                    example: 'file.jpg',
                },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createPrestasiDto: CreatePrestasiDto,
    ): Promise<Prestasi> {
        const fotoSrc = getFileUrl('prestasi', file);
        return this.prestasiService.create(createPrestasiDto, fotoSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Prestasi' })
    @ApiResponse({ status: 200, description: 'Returns all Prestasi' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Prestasi[], total: number }> {
        return this.prestasiService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Prestasi by ID' })
    @ApiParam({ name: 'id', description: 'Prestasi ID' })
    @ApiResponse({ status: 200, description: 'Returns the Prestasi' })
    async findOne(@Param('id') id: string): Promise<Prestasi> {
        return this.prestasiService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('prestasi')))
    @ApiOperation({ summary: 'Update a Prestasi by ID' })
    @ApiParam({ name: 'id', description: 'Prestasi ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    format: 'text',
                    description: 'Title of the prestasi',
                    example: 'Updated Achievement Title',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for prestasi image',
                    example: 'file.jpg',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updatePrestasiDto: UpdatePrestasiDto,
    ): Promise<Prestasi> {
        const fotoSrc = getFileUrl('prestasi', file);
        return this.prestasiService.update(id, updatePrestasiDto, fotoSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Prestasi by ID' })
    @ApiParam({ name: 'id', description: 'Prestasi ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Prestasi successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.prestasiService.remove(id);
    }
}
