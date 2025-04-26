import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { BrandModel, CategoryModel, ProductModel, SubCategoryModel } from 'src/DB/models';
import { BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository } from 'src/DB/repository';
import { CategoryService } from '../category/category.service';
import { UploadedFileService } from 'src/common/service/uploadService';

@Module({
  imports:[ProductModel,CategoryModel,BrandModel,SubCategoryModel],
  providers: [ProductService,ProductRepository,CategoryRepository,UploadedFileService,BrandRepository,SubCategoryRepository],
  controllers: [ProductController]
})
export class ProductModule {}
