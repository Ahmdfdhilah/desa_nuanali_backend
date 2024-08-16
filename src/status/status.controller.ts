import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StatusService } from './status.service';
import { Status } from '../entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('statuses')
@ApiTags('statuses')
export class StatusController {
    constructor(private readonly statusService: StatusService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Status' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Status',
                    example: 'Menikah',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people with this status',
                    example: 150,
                },
            },
        },
    })
    async create(@Body() createStatusDto: CreateStatusDto): Promise<Status> {
        return this.statusService.create(createStatusDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Statuses' })
    @ApiResponse({ status: 200, description: 'Returns all Statuses' })
    async findAll(): Promise<Status[]> {
        return this.statusService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Status by ID' })
    @ApiParam({ name: 'id', description: 'Status ID' })
    @ApiResponse({ status: 200, description: 'Returns the Status' })
    async findOne(@Param('id') id: string): Promise<Status> {
        return this.statusService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a Status by ID' })
    @ApiParam({ name: 'id', description: 'Status ID' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Status',
                    example: 'Bercerai',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people with this status',
                    example: 80,
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateStatusDto,
    ): Promise<Status> {
        return this.statusService.update(id, updateStatusDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Status by ID' })
    @ApiParam({ name: 'id', description: 'Status ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Status successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.statusService.remove(id);
    }
}
