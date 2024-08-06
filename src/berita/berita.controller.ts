import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { BeritaService } from './berita.service';
import { Berita } from 'src/entities/berita.entity';
import { CreateBeritaDto } from './dto/create-berita.dto';
import { UpdateBeritaDto } from './dto/update-berita.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('beritas')
@ApiTags('beritas')
export class BeritaController {
    constructor(private readonly beritaService: BeritaService) { }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('beritas')))
    @ApiOperation({ summary: 'Create a new Berita' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'title', 'date', 'slug'], 
            properties: {
                slug: {
                    type: 'string',
                    format: 'text',
                    description: 'Slug for the berita',
                    example: 'latest-news',
                },
                title: {
                    type: 'string',
                    format: 'text',
                    description: 'Title of the berita',
                    example: 'Breaking News Update',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for berita image',
                    example: 'image.jpg',
                },
                date: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of the berita',
                    example: '2024-08-05T14:30:00.000Z',
                },
                category: {
                    type: 'string',
                    format: 'text',
                    description: 'Category of the berita',
                    example: 'Politics',
                },
                author: {
                    type: 'string',
                    format: 'text',
                    description: 'Author of the berita',
                    example: 'Admin',
                },
                excerpt: {
                    type: 'string',
                    format: 'text',
                    description: 'Short excerpt of the berita',
                    example: 'An important update on the latest news...',
                },
                body: {
                    type: 'string',
                    format: 'text',
                    description: 'Full body of the berita',
                    example: 'Detailed description of the berita...',
                },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createBeritaDto: CreateBeritaDto,
    ): Promise<Berita> {
        const imgSrc = getFileUrl('beritas', file);
        console.log(imgSrc);
        
        return this.beritaService.create(createBeritaDto, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Beritas' })
    @ApiResponse({ status: 200, description: 'Returns all Beritas' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Berita[], total: number }> {
        return this.beritaService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Berita by ID' })
    @ApiParam({ name: 'id', description: 'Berita ID' })
    @ApiResponse({ status: 200, description: 'Returns the Berita' })
    async findOne(@Param('id') id: string): Promise<Berita> {
        return this.beritaService.findOne(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Put(':id')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('beritas')))
    @ApiOperation({ summary: 'Update a Berita by ID' })
    @ApiParam({ name: 'id', description: 'Berita ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                slug: {
                    type: 'string',
                    format: 'text',
                    description: 'Slug for the berita',
                    example: 'updated-news',
                },
                title: {
                    type: 'string',
                    format: 'text',
                    description: 'Title of the berita',
                    example: 'Updated News Headline',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload for berita image',
                    example: 'updated-image.jpg',
                },
                date: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of the berita',
                    example: '2024-08-05T14:30:00.000Z',
                },
                category: {
                    type: 'string',
                    format: 'text',
                    description: 'Category of the berita',
                    example: 'Economy',
                },
                author: {
                    type: 'string',
                    format: 'text',
                    description: 'Author of the berita',
                    example: 'Admin',
                },
                excerpt: {
                    type: 'string',
                    format: 'text',
                    description: 'Short excerpt of the berita',
                    example: 'An updated summary of the berita...',
                },
                body: {
                    type: 'string',
                    format: 'text',
                    description: 'Full body of the berita',
                    example: 'Updated detailed description of the berita...',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateBeritaDto: UpdateBeritaDto,
    ): Promise<Berita> {
        const imgSrc = getFileUrl('beritas', file);
        console.log(imgSrc);
        
        return this.beritaService.update(id, updateBeritaDto, imgSrc);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Berita by ID' })
    @ApiParam({ name: 'id', description: 'Berita ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Berita successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.beritaService.remove(id);
    }
}
