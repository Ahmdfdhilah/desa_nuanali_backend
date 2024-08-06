import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PembangunanService } from './pembangunan.service';
import { Pembangunan } from '../entities/pembangunan.entity';
import { CreatePembangunanDto } from './dto/create-pembangunan.dto';
import { UpdatePembangunanDto } from './dto/update-pembangunan.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrls } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
// import { Roles } from 'src/auth/decorators/roles.decorators';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
// import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('pembangunan')
@ApiTags('pembangunan')
export class PembangunanController {
    constructor(private readonly pembangunanService: PembangunanService) { }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('pembangunan')))
    @ApiOperation({ summary: 'Create a new Pembangunan' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['files', 'judul', 'lokasi', 'anggaran', 'tahun', 'progres'],
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'File uploads',
                    example: ['file1.jpg', 'file2.jpg'],
                },
                judul: {
                    type: 'string',
                    description: 'Judul Pembangunan',
                    example: 'Pembangunan Jalan Baru',
                },
                deskripsi: {
                    type: 'string',
                    description: 'Deskripsi Pembangunan',
                    example: 'Pembangunan jalan baru di desa',
                },
                lokasi: {
                    type: 'string',
                    description: 'Lokasi Pembangunan',
                    example: 'Desa Sukamaju',
                },
                anggaran: {
                    type: 'number',
                    description: 'Anggaran Pembangunan',
                    example: 15000000.00,
                },
                tahun: {
                    type: 'number',
                    description: 'Tahun Pembangunan',
                    example: 2024,
                },
                progres: {
                    type: 'number',
                    description: 'Progres Pembangunan',
                    example: 50,
                },
            },
        },
    })
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createPembangunanDto: CreatePembangunanDto,
    ): Promise<Pembangunan> {
        const fileUrls = getFileUrls('pembangunan', files);
        return this.pembangunanService.create(createPembangunanDto, fileUrls);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Pembangunan' })
    @ApiResponse({ status: 200, description: 'Returns all Pembangunan' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Pembangunan[], total: number }> {
        return this.pembangunanService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Pembangunan by ID' })
    @ApiParam({ name: 'id', description: 'Pembangunan ID' })
    @ApiResponse({ status: 200, description: 'Returns the Pembangunan' })
    async findOne(@Param('id') id: string): Promise<Pembangunan> {
        return this.pembangunanService.findOne(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Put(':id')
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('pembangunan')))
    @ApiOperation({ summary: 'Update a Pembangunan by ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', description: 'Pembangunan ID' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'File uploads',
                    example: ['file1.jpg', 'file2.jpg'],
                },
                judul: {
                    type: 'string',
                    description: 'Judul Pembangunan',
                    example: 'Pembangunan Jalan Baru',
                },
                deskripsi: {
                    type: 'string',
                    description: 'Deskripsi Pembangunan',
                    example: 'Pembangunan jalan baru di desa',
                },
                lokasi: {
                    type: 'string',
                    description: 'Lokasi Pembangunan',
                    example: 'Desa Sukamaju',
                },
                anggaran: {
                    type: 'number',
                    description: 'Anggaran Pembangunan',
                    example: 15000000.00,
                },
                tahun: {
                    type: 'number',
                    description: 'Tahun Pembangunan',
                    example: 2024,
                },
                progres: {
                    type: 'number',
                    description: 'Progres Pembangunan',
                    example: 50,
                },
                existingFotos: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Existing file URLs',
                    example: ['https://link-to-existing-file1.jpg', 'https://link-to-existing-file2.jpg'],
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() updatePembangunanDto: UpdatePembangunanDto,
    ): Promise<Pembangunan> {
        let fileUrls = updatePembangunanDto.existingFotos || [];

        if (files.length > 0) {
            const newFileUrls = getFileUrls('pembangunan', files);
            fileUrls = fileUrls.concat(newFileUrls);
        }

        return this.pembangunanService.update(id, updatePembangunanDto, fileUrls);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Pembangunan by ID' })
    @ApiParam({ name: 'id', description: 'Pembangunan ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Pembangunan successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.pembangunanService.remove(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Delete(':id/foto')
    @ApiOperation({ summary: 'Delete a Foto from Pembangunan by ID' })
    @ApiParam({ name: 'id', description: 'Pembangunan ID' })
    @ApiParam({ name: 'fotoUrl', description: 'Foto URL' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Foto successfully deleted' })
    async deleteFoto(
        @Param('id') id: string,
        @Query('fotoUrl') fotoUrl: string,
    ): Promise<void> {
        return this.pembangunanService.deleteFoto(id, fotoUrl);
    }
}
