import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryDto } from './Dto/category.dto';
import { UserDocument } from 'src/DB/models';
import { User } from 'src/common/decorator/user.decorator';
import { Auth } from 'src/common/decorator/auth.decorator';
import { userRoles } from 'src/common/types/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterHost, MulterLocal } from 'src/common/utils/multer';
import { updateCategoryDto } from './Dto/updateCategoryDto';
import { Types } from 'mongoose';

@Controller('category')
export class CategoryController {
    constructor(private readonly _CategoryService: CategoryService) { }
    @Post("/create")
    @Auth(userRoles.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('file',MulterHost(['image/png','image/jpeg','image/JPG'])))
    async createCategory(
        @Body() body: categoryDto,
        @User() user: UserDocument,
        @UploadedFile() file: Express.Multer.File) {
        return this._CategoryService.createCategory(body, user, file)

    }


    @Patch("/update/:id")
    @Auth(userRoles.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('file',MulterHost(['image/png','image/jpeg','image/JPG'])))
    async UpdateCategory(
        @Body() body: updateCategoryDto,
        @Param('id') id:Types.ObjectId,
        @User() user: UserDocument,
        @UploadedFile() file: Express.Multer.File) {
        return this._CategoryService.UpdateCategory(body, user, file,id)

    }
    @Delete("/delete/:id")
    @Auth(userRoles.admin)
    @UsePipes(new ValidationPipe())
    async DeleteCategory(
        @Param('id') id:Types.ObjectId,
        @User() user: UserDocument,
        ) {
        return this._CategoryService.DeleteCategory( user,id)

    }
    @Get()
    @Auth(userRoles.admin,userRoles.user,userRoles.crafter)
    async getAllCategories(
        ) {
        return this._CategoryService.getAllCategory()

    }
}
