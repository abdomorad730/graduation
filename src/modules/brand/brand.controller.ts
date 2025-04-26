import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BrandService } from './brand.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { MulterHost } from 'src/common/utils/multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { userRoles } from 'src/common/types/types';
import { User } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/models';
import { brandDto, updateBrandDto } from './dto/brand.dto';
import { Types } from 'mongoose';

@Controller('brand')
export class BrandController {
     constructor(private readonly _BrandService: BrandService) { }
        @Post("/create")
        @Auth(userRoles.admin)
        @UsePipes(new ValidationPipe())
        @UseInterceptors(FileInterceptor('file',MulterHost(['image/png','image/jpeg','image/JPG'])))
        async createBrand(
            @Body() body: brandDto,
            @User() user: UserDocument,
            @UploadedFile() file: Express.Multer.File) {
            return this._BrandService.createBrand(body, user, file)
    
        }
    
    
        @Patch("/update/:id")
        @Auth(userRoles.admin)
        @UsePipes(new ValidationPipe())
        @UseInterceptors(FileInterceptor('file',MulterHost(['image/png','image/jpeg','image/JPG'])))
        async UpdateBrand(
            @Body() body: updateBrandDto,
            @Param('id') id:Types.ObjectId,
            @User() user: UserDocument,
            @UploadedFile() file: Express.Multer.File) {
            return this._BrandService.UpdateBrand(body, user, file,id)
    
        }
        @Delete("/delete/:id")
        @Auth(userRoles.admin)
        @UsePipes(new ValidationPipe())
        async DeleteBrand(
            @Param('id') id:Types.ObjectId,
            @User() user: UserDocument,
            ) {
            return this._BrandService.DeleteBrand( user,id)
    
        }
        @Get()
        @Auth(userRoles.admin,userRoles.user,userRoles.crafter)
        async getAllCategories(
            ) {
            return this._BrandService.getAllBrand()
    
        }
}
