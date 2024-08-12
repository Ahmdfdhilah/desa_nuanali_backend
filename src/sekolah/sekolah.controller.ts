import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SekolahService } from './sekolah.service';
import { Sekolah } from '../entities/sekolah.entity';
import { CreateSekolahDto } from './dto/create-sekolah.dto';
import { UpdateSekolahDto } from './dto/update-sekolah.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('sekolah')
@ApiTags('sekolah')
export class SekolahController {
    constructor(private readonly sekolahService: SekolahService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Sekolah' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Sekolah',
                    example: 'SD',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of students in this Sekolah',
                    example: 200,
                },
            },
        },
    })
    async create(@Body() createSekolahDto: CreateSekolahDto): Promise<Sekolah> {
        return this.sekolahService.create(createSekolahDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Sekolah' })
    @ApiResponse({ status: 200, description: 'Returns all Sekolah' })
    async findAll(): Promise<Sekolah[]> {
        return this.sekolahService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Sekolah by ID' })
    @ApiParam({ name: 'id', description: 'Sekolah ID' })
    @ApiResponse({ status: 200, description: 'Returns the Sekolah' })
    async findOne(@Param('id') id: string): Promise<Sekolah> {
        return this.sekolahService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a Sekolah by ID' })
    @ApiParam({ name: 'id', description: 'Sekolah ID' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Sekolah',
                    example: 'SMP',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of students in this Sekolah',
                    example: 250,
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateSekolahDto: UpdateSekolahDto,
    ): Promise<Sekolah> {
        return this.sekolahService.update(id, updateSekolahDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Sekolah by ID' })
    @ApiParam({ name: 'id', description: 'Sekolah ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Sekolah successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.sekolahService.remove(id);
    }
}
