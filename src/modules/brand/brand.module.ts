import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { UploadedFileService } from 'src/common/service/uploadService';
import { BrandRepository, CategoryRepository } from 'src/DB/repository';
import { AuthGuard } from 'src/common/guard/userGuard';
import { CategoryService } from '../category/category.service';
import { BrandModel, CategoryModel } from 'src/DB/models';
import { BrandService } from './brand.service';

@Module({
    imports:[CategoryModel,BrandModel],
    controllers:[BrandController],
    providers:[CategoryService,AuthGuard,CategoryRepository,UploadedFileService,BrandRepository,BrandService]
})
export class BrandModule {}
