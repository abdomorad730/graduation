import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartRepository } from 'src/DB/repository/cart.Repository';
import { CouponRepository, OrderRepository, ProductRepository } from 'src/DB/repository';
import { CartModel, CouponModel, OrderModel, ProductModel } from 'src/DB/models';
import { paymentService } from './sevice/payment.service';

@Module({
  imports:[CartModel,OrderModel,CouponModel,ProductModel],
  controllers: [OrderController],
  providers: [OrderService,CartRepository,OrderRepository,paymentService,CouponRepository,ProductRepository]
})
export class OrderModule {}
