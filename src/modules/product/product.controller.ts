import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/common/decorator/auth.decorator';
import { userRoles } from 'src/common/types/types';
import { ProductService } from './product.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/models';
import { ProductDto, queryDto, updateProductDto } from './Dto/product.Dto';
import { MulterHost } from 'src/common/utils/multer';
import { Types } from 'mongoose';

@Controller('product')
export class ProductController {
  constructor(private readonly _ProductService: ProductService) { }
  @Post("/create")
  @Auth(userRoles.crafter)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ], MulterHost(['image/png', 'image/jpeg', 'image/JPG'])),)
  async createProduct(
    @Body() body: ProductDto,
    @User() user: UserDocument,
    @UploadedFiles() files: { imageCover?: Express.Multer.File[], images?: Express.Multer.File[] }) {
    return this._ProductService.createProduct(body, user, files)

  }


  @Patch("/update/:productId")
  @Auth(userRoles.crafter)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ], MulterHost(['image/png', 'image/jpeg', 'image/JPG'])),)
  async updateProduct(
    @Body() body: updateProductDto,
    @Param('productId') productId: Types.ObjectId,
    @User() user: UserDocument,
    @UploadedFiles() files: { imageCover?: Express.Multer.File[], images?: Express.Multer.File[] }) {
    return this._ProductService.updateProduct(body, user, files, productId)

  }

  @Delete("/delete/:productId")
  @Auth(userRoles.admin,userRoles.crafter)
  @UsePipes(new ValidationPipe())
  async deleteProduct(
    @Param('productId') productId: Types.ObjectId,
    @User() user: UserDocument) {
    return this._ProductService.deleteProduct( user, productId)
  }

  @Get()
  @UsePipes(new ValidationPipe())
  async getAllProducts(@Query() query:queryDto){
    return this._ProductService.getAllProducts(query)
  }

  @Patch("/washlist/:productId")
  @Auth(userRoles.admin,userRoles.user,userRoles.crafter)
  @UsePipes(new ValidationPipe())
  async addOrdeleteProduct(
    @Param('productId') productId: Types.ObjectId,
    @User() user: UserDocument) {
    return this._ProductService.addOrdeleteProduct( user, productId)
  }
  @Get("/washlist")
  @Auth(userRoles.admin,userRoles.user,userRoles.crafter)
  @UsePipes(new ValidationPipe())
  async getWashlist(
    @User() user: UserDocument) {
    return this._ProductService.getWashlist( user)
  }

}
