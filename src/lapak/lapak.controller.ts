import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { LapakService } from './lapak.service';
import { Lapak } from 'src/entities/lapak.entity';
import { CreateLapakDto } from './dto/create-lapak.dto';
import { UpdateLapakDto } from './dto/update-lapak.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';

@Controller('lapak')
@ApiTags('lapak')
export class LapakController {
    constructor(private readonly lapakService: LapakService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('lapak')))
    @ApiOperation({ summary: 'Create a new Lapak' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'name', 'price', 'phone', 'seller', 'description', 'location', 'contactPerson'], 
            properties: {
                name: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the lapak',
                    example: 'Lapak A',
                },
                price: {
                    type: 'string',
                    format: 'text',
                    description: 'Price of the lapak',
                    example: 'Rp100.000',
                },
                phone: {
                    type: 'string',
                    format: 'text',
                    description: 'Phone number for contact',
                    example: '081234567890',
                },
                seller: {
                    type: 'string',
                    format: 'text',
                    description: 'Seller name',
                    example: 'Penjual A',
                },
                description: {
                    type: 'string',
                    format: 'text',
                    description: 'Description of the lapak',
                    example: 'Deskripsi lapak A.',
                },
                location: {
                    type: 'string',
                    format: 'text',
                    description: 'Location of the lapak',
                    example: 'Desa A',
                },
                contactPerson: {
                    type: 'string',
                    format: 'text',
                    description: 'Contact person for the lapak',
                    example: 'Kontak A',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for lapak image',
                    example: 'file.jpg',
                },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createLapakDto: CreateLapakDto,
    ): Promise<Lapak> {
        const imageSrc = getFileUrl('lapak', file);
        return this.lapakService.create(createLapakDto, imageSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Lapak' })
    @ApiResponse({ status: 200, description: 'Returns all Lapak' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Lapak[], total: number }> {
        return this.lapakService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Lapak by ID' })
    @ApiParam({ name: 'id', description: 'Lapak ID' })
    @ApiResponse({ status: 200, description: 'Returns the Lapak' })
    async findOne(@Param('id') id: string): Promise<Lapak> {
        return this.lapakService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('lapak')))
    @ApiOperation({ summary: 'Update a Lapak by ID' })
    @ApiParam({ name: 'id', description: 'Lapak ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the lapak',
                    example: 'Updated Lapak A',
                },
                price: {
                    type: 'string',
                    format: 'text',
                    description: 'Price of the lapak',
                    example: 'Rp150.000',
                },
                phone: {
                    type: 'string',
                    format: 'text',
                    description: 'Phone number for contact',
                    example: '081234567891',
                },
                seller: {
                    type: 'string',
                    format: 'text',
                    description: 'Seller name',
                    example: 'Updated Penjual A',
                },
                description: {
                    type: 'string',
                    format: 'text',
                    description: 'Description of the lapak',
                    example: 'Updated Deskripsi lapak A.',
                },
                location: {
                    type: 'string',
                    format: 'text',
                    description: 'Location of the lapak',
                    example: 'Updated Desa A',
                },
                contactPerson: {
                    type: 'string',
                    format: 'text',
                    description: 'Contact person for the lapak',
                    example: 'Updated Kontak A',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for lapak image',
                    example: 'file.jpg',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateLapakDto: UpdateLapakDto,
    ): Promise<Lapak> {
        const imageSrc = getFileUrl('lapak', file);
        return this.lapakService.update(id, updateLapakDto, imageSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Lapak by ID' })
    @ApiParam({ name: 'id', description: 'Lapak ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Lapak successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.lapakService.remove(id);
    }
}
