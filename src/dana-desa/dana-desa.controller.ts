import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { DanaDesaService } from './dana-desa.service';
import { DanaDesa } from 'src/entities/dana-desa.entity';
import { CreateDanaDesaDto } from './dto/create-dana-desa.dto';
import { UpdateDanaDesaDto } from './dto/update-dana-desa.dto';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('dana-desas')
@ApiTags('dana-desas')
export class DanaDesaController {
    constructor(private readonly danaDesaService: DanaDesaService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new DanaDesa' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nama: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the DanaDesa',
                    example: 'Dana Pembangunan Jalan',
                },
                anggaran: {
                    type: 'number',
                    format: 'float',
                    description: 'Budget amount',
                    example: 10000000.00,
                },
                realisasi: {
                    type: 'number',
                    format: 'float',
                    description: 'Realization amount',
                    example: 5000000.00,
                },
                tipe: {
                    type: 'string',
                    format: 'text',
                    description: 'Type of the DanaDesa',
                    example: 'Pembangunan',
                },
            },
        },
    })
    async create(@Body() createDanaDesaDto: CreateDanaDesaDto): Promise<DanaDesa> {
        return this.danaDesaService.create(createDanaDesaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all DanaDesas' })
    @ApiResponse({ status: 200, description: 'Returns all DanaDesas' })
    async findAll(@Query() query: QueryDto): Promise<{ data: DanaDesa[], total: number }> {
        return this.danaDesaService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a DanaDesa by ID' })
    @ApiParam({ name: 'id', description: 'DanaDesa ID' })
    @ApiResponse({ status: 200, description: 'Returns the DanaDesa' })
    async findOne(@Param('id') id: string): Promise<DanaDesa> {
        return this.danaDesaService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a DanaDesa by ID' })
    @ApiParam({ name: 'id', description: 'DanaDesa ID' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nama: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the DanaDesa',
                    example: 'Dana Pembangunan Jalan Baru',
                },
                anggaran: {
                    type: 'number',
                    format: 'float',
                    description: 'Budget amount',
                    example: 15000000.00,
                },
                realisasi: {
                    type: 'number',
                    format: 'float',
                    description: 'Realization amount',
                    example: 7500000.00,
                },
                tipe: {
                    type: 'string',
                    format: 'text',
                    description: 'Type of the DanaDesa',
                    example: 'Renovasi',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateDanaDesaDto: UpdateDanaDesaDto,
    ): Promise<DanaDesa> {
        return this.danaDesaService.update(id, updateDanaDesaDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a DanaDesa by ID' })
    @ApiParam({ name: 'id', description: 'DanaDesa ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'DanaDesa successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.danaDesaService.remove(id);
    }
}