import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { LembagaService } from './lembaga.service';
import { Lembaga } from 'src/entities/lembaga.entity';
import { CreateLembagaDto } from './dto/create-lembaga.dto';
import { UpdateLembagaDto } from './dto/update-lembaga.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('lembagas')
@ApiTags('lembagas')
export class LembagaController {
    constructor(private readonly lembagaService: LembagaService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('lembagas')))
    @ApiOperation({ summary: 'Create a new Lembaga' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'name', 'description', 'contact'],
            properties: {
                name: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the lembaga',
                    example: 'Kantor Desa',
                },
                description: {
                    type: 'string',
                    format: 'text',
                    description: 'Description of the lembaga',
                    example: 'Kantor pusat administrasi desa yang melayani berbagai kebutuhan administrasi dan masyarakat.',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for lembaga image',
                    example: 'image.jpg',
                },
                contact: {
                    type: 'string',
                    format: 'text',
                    description: 'Contact information of the lembaga',
                    example: '0821-1234-5678',
                },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createLembagaDto: CreateLembagaDto,
    ): Promise<Lembaga> {
        const imgSrc = getFileUrl('lembagas', file);
        console.log(imgSrc);

        return this.lembagaService.create(createLembagaDto, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Lembagas' })
    @ApiResponse({ status: 200, description: 'Returns all Lembagas' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Lembaga[], total: number }> {
        return this.lembagaService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Lembaga by ID' })
    @ApiParam({ name: 'id', description: 'Lembaga ID' })
    @ApiResponse({ status: 200, description: 'Returns the Lembaga' })
    async findOne(@Param('id') id: string): Promise<Lembaga> {
        return this.lembagaService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('lembagas')))
    @ApiOperation({ summary: 'Update a Lembaga by ID' })
    @ApiParam({ name: 'id', description: 'Lembaga ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the lembaga',
                    example: 'Balai Desa',
                },
                description: {
                    type: 'string',
                    format: 'text',
                    description: 'Description of the lembaga',
                    example: 'Tempat kegiatan komunitas dan acara desa, termasuk rapat dan kegiatan sosial.',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for lembaga image',
                    example: 'updated_image.jpg',
                },
                contact: {
                    type: 'string',
                    format: 'text',
                    description: 'Contact information of the lembaga',
                    example: '0821-5678-9012',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateLembagaDto: UpdateLembagaDto,
    ): Promise<Lembaga> {
        const imgSrc = getFileUrl('lembagas', file);
        console.log(imgSrc);

        return this.lembagaService.update(id, updateLembagaDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Lembaga by ID' })
    @ApiParam({ name: 'id', description: 'Lembaga ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Lembaga successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.lembagaService.remove(id);
    }
}
