import { Body, Controller, Get, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { userRoles } from 'src/common/types/types';
import { UserDocument } from 'src/DB/models';
import { User } from 'src/common/decorator/user.decorator';
import { orderDto, paymentDto } from './dto/orderDto';
import { date } from 'zod';

@Controller('order')
export class OrderController {
       constructor(private readonly _OrderService: OrderService) { }
            
            @Post("/create")
            @Auth(userRoles.admin,userRoles.user,userRoles.crafter)
            @UsePipes(new ValidationPipe())
            async createCoupon(
                @Body() body: orderDto,
                @User() user: UserDocument) {
                return this._OrderService.createOrder(body, user)
        
            }
            @Post("/create-payment")
            @Auth(userRoles.admin,userRoles.user,userRoles.crafter)
            @UsePipes(new ValidationPipe())
            async createPaymentWithStripe(
                @Body() body:paymentDto,
                @User() user: UserDocument) {
                return this._OrderService.createPaymentWithStripe(body, user)
        
            }
            @Post("webhook")
            async webhook( @Body() data:any) {
                return this._OrderService.webhook(data)
        
            }
            @Patch("/cancel-payment")
            @Auth(userRoles.admin,userRoles.user,userRoles.crafter)
            @UsePipes(new ValidationPipe())
            async cancelPayment(
                @Body() body:paymentDto,
                @User() user: UserDocument) {
                return this._OrderService.cancelPayment(body, user)
        
            }
            @Get("")
            @Auth(userRoles.admin,userRoles.user,userRoles.crafter)
            @UsePipes(new ValidationPipe())
            async getAllorders() {
                return this._OrderService.getAllorders()
        
            }

}
