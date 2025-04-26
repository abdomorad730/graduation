import { Module } from '@nestjs/common';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { AuthGuard } from 'src/common/guard/userGuard';
import { CategoryRepository, SubCategoryRepository } from 'src/DB/repository';
import { UploadedFileService } from 'src/common/service/uploadService';
import { CategoryModel, SubCategoryModel } from 'src/DB/models';

@Module({
  imports:[SubCategoryModel,CategoryModel],
  controllers: [SubCategoryController],
  providers: [SubCategoryService,AuthGuard,SubCategoryRepository,CategoryRepository,UploadedFileService]
})
export class SubCategoryModule {}
