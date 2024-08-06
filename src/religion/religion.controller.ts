import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ReligionService } from './religion.service';
import { Religion } from '../entities/religion.entity';
import { CreateReligionDto } from './dto/create-religion.dto';
import { UpdateReligionDto } from './dto/update-religion.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('religions')
@ApiTags('religions')
export class ReligionController {
    constructor(private readonly religionService: ReligionService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Religion' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Religion',
                    example: 'Islam',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people in this religion',
                    example: 200,
                },
            },
        },
    })
    async create(@Body() createReligionDto: CreateReligionDto): Promise<Religion> {
        return this.religionService.create(createReligionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Religions' })
    @ApiResponse({ status: 200, description: 'Returns all Religions' })
    async findAll(): Promise<Religion[]> {
        return this.religionService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Religion by ID' })
    @ApiParam({ name: 'id', description: 'Religion ID' })
    @ApiResponse({ status: 200, description: 'Returns the Religion' })
    async findOne(@Param('id') id: string): Promise<Religion> {
        return this.religionService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a Religion by ID' })
    @ApiParam({ name: 'id', description: 'Religion ID' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Religion',
                    example: 'Hindu',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people in this religion',
                    example: 150,
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateReligionDto: UpdateReligionDto,
    ): Promise<Religion> {
        return this.religionService.update(id, updateReligionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Religion by ID' })
    @ApiParam({ name: 'id', description: 'Religion ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Religion successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.religionService.remove(id);
    }
}