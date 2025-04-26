import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import {  ProductRepository } from 'src/DB/repository';
import { CartModel, ProductModel } from 'src/DB/models';
import { CartRepository } from 'src/DB/repository/cart.Repository';

@Module({
  imports:[CartModel,ProductModel],
  controllers: [CartController],
  providers: [CartService,CartRepository,ProductRepository]
})
export class CartModule {}
