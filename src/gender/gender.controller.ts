import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { GenderService } from './gender.service';
import { Gender } from '../entities/gender.entity';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('genders')
@ApiTags('genders')
export class GenderController {
    constructor(private readonly genderService: GenderService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Gender' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Gender',
                    example: 'Laki-Laki',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of individuals of this gender',
                    example: 500,
                },
            },
        },
    })
    async create(@Body() createGenderDto: CreateGenderDto): Promise<Gender> {
        return this.genderService.create(createGenderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Genders' })
    @ApiResponse({ status: 200, description: 'Returns all Genders' })
    async findAll(): Promise<Gender[]> {
        return this.genderService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Gender by ID' })
    @ApiParam({ name: 'id', description: 'Gender ID' })
    @ApiResponse({ status: 200, description: 'Returns the Gender' })
    async findOne(@Param('id') id: string): Promise<Gender> {
        return this.genderService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a Gender by ID' })
    @ApiParam({ name: 'id', description: 'Gender ID' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the Gender',
                    example: 'Perempuan',
                },
                total: {
                    type: 'number',
                    format: 'int',
                    description: 'Total number of individuals of this gender',
                    example: 600,
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateGenderDto: UpdateGenderDto,
    ): Promise<Gender> {
        return this.genderService.update(id, updateGenderDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Gender by ID' })
    @ApiParam({ name: 'id', description: 'Gender ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Gender successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.genderService.remove(id);
    }
}
