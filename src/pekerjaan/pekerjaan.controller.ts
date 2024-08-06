import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { PekerjaanService } from './pekerjaan.service';
import { Pekerjaan } from 'src/entities/pekerjaan.entity';
import { CreatePekerjaanDto } from './dto/create-pekerjaan.dto';
import { UpdatePekerjaanDto } from './dto/update-pekerjaan.dto';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('pekerjaans')
@ApiTags('pekerjaans')
export class PekerjaanController {
    constructor(private readonly pekerjaanService: PekerjaanService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Pekerjaan' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Pekerjaan',
                    example: 'Pegawai Negeri Sipil',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people in this job category',
                    example: 50,
                },
            },
        },
    })
    async create(@Body() createPekerjaanDto: CreatePekerjaanDto): Promise<Pekerjaan> {
        return this.pekerjaanService.create(createPekerjaanDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Pekerjaans' })
    @ApiResponse({ status: 200, description: 'Returns all Pekerjaans' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Pekerjaan[], total: number }> {
        return this.pekerjaanService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Pekerjaan by ID' })
    @ApiParam({ name: 'id', description: 'Pekerjaan ID' })
    @ApiResponse({ status: 200, description: 'Returns the Pekerjaan' })
    async findOne(@Param('id') id: string): Promise<Pekerjaan> {
        return this.pekerjaanService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a Pekerjaan by ID' })
    @ApiParam({ name: 'id', description: 'Pekerjaan ID' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Pekerjaan',
                    example: 'Pengacara',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people in this job category',
                    example: 30,
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updatePekerjaanDto: UpdatePekerjaanDto,
    ): Promise<Pekerjaan> {
        return this.pekerjaanService.update(id, updatePekerjaanDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Pekerjaan by ID' })
    @ApiParam({ name: 'id', description: 'Pekerjaan ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Pekerjaan successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.pekerjaanService.remove(id);
    }
}