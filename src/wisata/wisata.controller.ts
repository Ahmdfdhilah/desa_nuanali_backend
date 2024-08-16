import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { WisataService } from './wisata.service';
import { Wisata } from '../entities/wisata.entity';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrls } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('wisata')
@ApiTags('wisata')
export class WisataController {
    constructor(private readonly wisataService: WisataService) { }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('wisata')))
    @ApiOperation({ summary: 'Create a new Wisata' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['files', 'title'],
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
                title: {
                    type: 'string',
                    description: 'Title of the Wisata',
                    example: 'Beautiful Beach',
                },
                body: {
                    type: 'string',
                    description: 'Description of the Wisata',
                    example: 'A beautiful beach with golden sands and clear waters.',
                },
            },
        },
    })
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createWisataDto: CreateWisataDto,
    ): Promise<Wisata> {
        const fileUrls = getFileUrls('wisata', files);
        return this.wisataService.create(createWisataDto, fileUrls);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Wisata' })
    @ApiResponse({ status: 200, description: 'Returns all Wisata' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Wisata[], total: number }> {
        return this.wisataService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Wisata by ID' })
    @ApiParam({ name: 'id', description: 'Wisata ID' })
    @ApiResponse({ status: 200, description: 'Returns the Wisata' })
    async findOne(@Param('id') id: string): Promise<Wisata> {
        return this.wisataService.findOne(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Put(':id')
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('wisata')))
    @ApiOperation({ summary: 'Update a Wisata by ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', description: 'Wisata ID' })
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
                title: {
                    type: 'string',
                    description: 'Title of the Wisata',
                    example: 'Updated Beach',
                },
                body: {
                    type: 'string',
                    description: 'Description of the Wisata',
                    example: 'An updated description of the beautiful beach.',
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
        @Body() updateWisataDto: UpdateWisataDto,
    ): Promise<Wisata> {
        let fileUrls = updateWisataDto.existingFotos || [];

        if (files.length > 0) {
            const newFileUrls = getFileUrls('wisata', files);
            fileUrls = fileUrls.concat(newFileUrls);
        }

        return this.wisataService.update(id, updateWisataDto, fileUrls);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Wisata by ID' })
    @ApiParam({ name: 'id', description: 'Wisata ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Wisata successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.wisataService.remove(id);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    @Delete(':id/foto')
    @ApiOperation({ summary: 'Delete a Foto from Wisata by ID' })
    @ApiParam({ name: 'id', description: 'Wisata ID' })
    @ApiParam({ name: 'fotoUrl', description: 'Foto URL' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Foto successfully deleted' })
    async deleteFoto(
        @Param('id') id: string,
        @Query('fotoUrl') fotoUrl: string,
    ): Promise<void> {
        console.log(fotoUrl);
        return this.wisataService.deleteFoto(id, fotoUrl);
    }
}
