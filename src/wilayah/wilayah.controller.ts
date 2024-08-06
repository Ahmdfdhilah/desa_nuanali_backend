import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { WilayahService } from './wilayah.service';
import { Wilayah } from 'src/entities/wilayah.entity';
import { CreateWilayahDto } from './dto/create-wilayah.dto';
import { UpdateWilayahDto } from './dto/update-wilayah.dto';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('wilayahs')
@ApiTags('wilayahs')
export class WilayahController {
    constructor(private readonly wilayahService: WilayahService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Wilayah' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the Wilayah',
                    example: 'Wilayah B',
                },
                rt: {
                    type: 'number',
                    format: 'int',
                    description: 'RT number of the Wilayah',
                    example: 2,
                },
                kk: {
                    type: 'number',
                    format: 'int',
                    description: 'KK number of the Wilayah',
                    example: 2,
                },
                male: {
                    type: 'number',
                    format: 'int',
                    description: 'Number of male residents',
                    example: 200,
                },
                female: {
                    type: 'number',
                    format: 'int',
                    description: 'Number of female residents',
                    example: 180,
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of residents',
                    example: 380,
                },
            },
        },
    })
    async create(@Body() createWilayahDto: CreateWilayahDto): Promise<Wilayah> {
        return this.wilayahService.create(createWilayahDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Wilayahs' })
    @ApiResponse({ status: 200, description: 'Returns all Wilayahs' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Wilayah[], total: number }> {
        return this.wilayahService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Wilayah by ID' })
    @ApiParam({ name: 'id', description: 'Wilayah ID' })
    @ApiResponse({ status: 200, description: 'Returns the Wilayah' })
    async findOne(@Param('id') id: string): Promise<Wilayah> {
        return this.wilayahService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a Wilayah by ID' })
    @ApiParam({ name: 'id', description: 'Wilayah ID' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the Wilayah',
                    example: 'Wilayah B',
                },
                rt: {
                    type: 'number',
                    format: 'int',
                    description: 'RT number of the Wilayah',
                    example: 2,
                },
                kk: {
                    type: 'number',
                    format: 'int',
                    description: 'KK number of the Wilayah',
                    example: 2,
                },
                male: {
                    type: 'number',
                    format: 'int',
                    description: 'Number of male residents',
                    example: 200,
                },
                female: {
                    type: 'number',
                    format: 'int',
                    description: 'Number of female residents',
                    example: 180,
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of residents',
                    example: 380,
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateWilayahDto: UpdateWilayahDto,
    ): Promise<Wilayah> {
        return this.wilayahService.update(id, updateWilayahDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Wilayah by ID' })
    @ApiParam({ name: 'id', description: 'Wilayah ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Wilayah successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.wilayahService.remove(id);
    }
}