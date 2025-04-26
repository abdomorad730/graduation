import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/common/decorator/auth.decorator';
import { MulterHost } from 'src/common/utils/multer';
import { subCategoryDto, updateSubCategoryDto } from './dto/subCategoryDto';
import { UserDocument } from 'src/DB/models';
import { User } from 'src/common/decorator/user.decorator';
import { userRoles } from 'src/common/types/types';
import { Types } from 'mongoose';
import { SubCategoryService } from './sub-category.service';

@Controller('sub-category')
export class SubCategoryController {
    constructor(private readonly SubCategoryService: SubCategoryService) { }
            @Post("/create")
            @Auth(userRoles.admin)
            @UsePipes(new ValidationPipe())
            @UseInterceptors(FileInterceptor('file',MulterHost(['image/png','image/jpeg','image/JPG'])))
            async createSubCategory(
                @Body() body: subCategoryDto,
                @User() user: UserDocument,
                @UploadedFile() file: Express.Multer.File) {
                return this.SubCategoryService.createSubCategory(body, user, file)
        
            }
        
        
            @Patch("/update/:id")
            @Auth(userRoles.admin)
            @UsePipes(new ValidationPipe())
            @UseInterceptors(FileInterceptor('file',MulterHost(['image/png','image/jpeg','image/JPG'])))
            async UpdateSubCategory(
                @Body() body: updateSubCategoryDto,
                @Param('id') id:Types.ObjectId,
                @User() user: UserDocument,
                @UploadedFile() file: Express.Multer.File) {
                return this.SubCategoryService.UpdateSubCategory(body, user, file,id)
        
            }
            @Delete("/delete/:id")
            @Auth(userRoles.admin)
            @UsePipes(new ValidationPipe())
            async DeleteSubCategory(
                @Param('id') id:Types.ObjectId,
                @User() user: UserDocument,
                ) {
                return this.SubCategoryService.DeleteSubCategory( user,id)
        
            }
            @Get("/:id")
            @Auth(userRoles.admin,userRoles.user,userRoles.crafter)
            async getAllCategories(
                @Param("id") id:Types.ObjectId
                ) {
                return this.SubCategoryService.getAllSubCategory(id)
        
            }
}
