import { Body, Controller, Delete, Get, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { userRoles } from 'src/common/types/types';
import { Auth } from 'src/common/decorator/auth.decorator';
import { cartDto, removeFromCartDto } from './dto/cartDto';
import { User } from 'src/common/decorator/user.decorator';
import { UserDocument } from 'src/DB/models';

@Controller('cart')
export class CartController {

    constructor(private readonly _CartService: CartService) { }

    @Post("create")
    @Auth(userRoles.admin, userRoles.user,userRoles.crafter)
    @UsePipes(new ValidationPipe())
    async createCart(
        @Body() body: cartDto,
        @User() user: UserDocument) {
        return this._CartService.createCart(body, user)

    }
    @Delete("remove")
    @Auth(userRoles.admin, userRoles.user,userRoles.crafter)
    @UsePipes(new ValidationPipe())
    async removeFromCart(
        @Body() body: removeFromCartDto,
        @User() user: UserDocument) {
        return this._CartService.removeFromCart(body, user)


    }
    @Delete("clear")
    @Auth(userRoles.admin, userRoles.user,userRoles.crafter)
    @UsePipes(new ValidationPipe())
    async clearCart(
        @User() user: UserDocument) {
        return this._CartService.clearCart(user)

    }
    @Patch("update")
    @Auth(userRoles.admin, userRoles.user,userRoles.crafter)
    @UsePipes(new ValidationPipe())
    async updateQuantityCart(
        @Body() body: cartDto,
        @User() user: UserDocument) {
        return this._CartService.updateQuantityCart(body, user)

    }
    @Get("")
    @Auth(userRoles.admin, userRoles.user,userRoles.crafter)
    @UsePipes(new ValidationPipe())
    async getCart(
        @User() user: UserDocument) {
        return this._CartService.getCart( user)

    }
}
