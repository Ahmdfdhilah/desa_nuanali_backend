import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { EducationService } from './education.service';
import { Education } from '../entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('educations')
@ApiTags('educations')
export class EducationController {
    constructor(private readonly educationService: EducationService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Education record' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Education level',
                    example: 'SD',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people with this education level',
                    example: 1000,
                },
            },
        },
    })
    async create(@Body() createEducationDto: CreateEducationDto): Promise<Education> {
        return this.educationService.create(createEducationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Education records' })
    @ApiResponse({ status: 200, description: 'Returns all Education records' })
    async findAll(): Promise<Education[]> {
        return this.educationService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an Education record by ID' })
    @ApiParam({ name: 'id', description: 'Education record ID' })
    @ApiResponse({ status: 200, description: 'Returns the Education record' })
    async findOne(@Param('id') id: string): Promise<Education> {
        return this.educationService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an Education record by ID' })
    @ApiParam({ name: 'id', description: 'Education record ID' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Education level',
                    example: 'SMA',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of people with this education level',
                    example: 1200,
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateEducationDto: UpdateEducationDto,
    ): Promise<Education> {
        return this.educationService.update(id, updateEducationDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an Education record by ID' })
    @ApiParam({ name: 'id', description: 'Education record ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Education record successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.educationService.remove(id);
    }
}
