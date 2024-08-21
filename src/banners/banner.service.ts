import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from 'src/entities/banners.entity';
import { BannerDto } from './dto/banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) { }

  async create(createBannerDto: BannerDto, imgSrc: string): Promise<Banner> {
    const newBanner = this.bannerRepository.create({ ...createBannerDto, img: imgSrc });
    return this.bannerRepository.save(newBanner);
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }
    return banner;
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerRepository.find({ order: { order: 'ASC' } });
  }

  async remove(id: string): Promise<void> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    await this.bannerRepository.delete(id);
  }

  async updateBannerOrder(bannerId: string, newOrder: number): Promise<void> {
    const banner = await this.bannerRepository.findOne({ where: { id: bannerId } });
    if (!banner) {
      throw new NotFoundException(`Banner with id ${bannerId} not found`);
    }

    banner.order = newOrder;
    await this.bannerRepository.save(banner);
  }

  async reorderBanners(banners: { id: string, order: number }[]): Promise<void> {
    const updatePromises = banners.map(async (banner, index) => {
      const foundBanner = await this.bannerRepository.findOne({ where: { id: banner.id } });
      if (!foundBanner) {
        throw new NotFoundException(`Banner with id ${banner.id} not found`);
      }
      foundBanner.order = index + 1;
      await this.bannerRepository.save(foundBanner);
    });

    await Promise.all(updatePromises);
  }
}