import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guard/userGuard';
import { tokenService } from 'src/common/service/tokenService';
import { CategoryRepository, userRepository } from 'src/DB/repository';
import { JwtService } from '@nestjs/jwt';
import { CategoryModel, UserModel } from 'src/DB/models';
import { UploadedFileService } from 'src/common/service/uploadService';

@Module({
  imports:[CategoryModel],
  controllers: [CategoryController],
  providers: [CategoryService,AuthGuard,CategoryRepository,UploadedFileService]
})
export class CategoryModule {}
