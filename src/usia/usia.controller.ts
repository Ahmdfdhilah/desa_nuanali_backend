import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsiaService } from './usia.service';
import { Usia } from '../entities/usia.entity';
import { CreateUsiaDto } from './dto/create-usia.dto';
import { UpdateUsiaDto } from './dto/update-usia.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('usias')
@ApiTags('usias')
export class UsiaController {
    constructor(private readonly usiaService: UsiaService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Usia' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Age group of the Usia',
                    example: '21 - 30 Tahun',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people in this age group',
                    example: 200,
                },
            },
        },
    })
    async create(@Body() createUsiaDto: CreateUsiaDto): Promise<Usia> {
        return this.usiaService.create(createUsiaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Usias' })
    @ApiResponse({ status: 200, description: 'Returns all Usias' })
    async findAll(): Promise<Usia[]> {
        return this.usiaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Usia by ID' })
    @ApiParam({ name: 'id', description: 'Usia ID' })
    @ApiResponse({ status: 200, description: 'Returns the Usia' })
    async findOne(@Param('id') id: string): Promise<Usia> {
        return this.usiaService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a Usia by ID' })
    @ApiParam({ name: 'id', description: 'Usia ID' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Age group of the Usia',
                    example: '31 - 40 Tahun',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people in this age group',
                    example: 180,
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateUsiaDto: UpdateUsiaDto,
    ): Promise<Usia> {
        return this.usiaService.update(id, updateUsiaDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Usia by ID' })
    @ApiParam({ name: 'id', description: 'Usia ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Usia successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.usiaService.remove(id);
    }
}
