import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { Video } from '../entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('videos')
@ApiTags('videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Video' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                link: {
                    type: 'string',
                    description: 'URL link of the video',
                    example: 'https://example.com/video.mp4',
                },
                isVertical: {
                    type: 'bool',
                    description: 'Sizing of the video',
                    example: 'false',
                },
            },
        },
    })
    async create(@Body() createVideoDto: CreateVideoDto): Promise<Video> {
        return this.videoService.create(createVideoDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Videos' })
    @ApiResponse({ status: 200, description: 'Returns all Videos' })
    async findAll(): Promise<Video[]> {
        return this.videoService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Video by ID' })
    @ApiParam({ name: 'id', description: 'Video ID' })
    @ApiResponse({ status: 200, description: 'Returns the Video' })
    async findOne(@Param('id') id: string): Promise<Video> {
        return this.videoService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Video by ID' })
    @ApiParam({ name: 'id', description: 'Video ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Video successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.videoService.remove(id);
    }
}
