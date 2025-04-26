import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/DB/repository';
import { cartDto, removeFromCartDto } from './dto/cartDto';
import { UserDocument } from 'src/DB/models';
import { CartRepository } from 'src/DB/repository/cart.Repository';

@Injectable()
export class CartService {
     constructor(
            private readonly CartRepository:CartRepository,
            private readonly ProductRepository:ProductRepository,

    
        ) { }
        async createCart(body:cartDto,user:UserDocument){
            const {productId,quantity}=body
            const product =await this.ProductRepository.findOne({_id:productId,stock:{$gte:quantity}})
            if(!product){
                throw new NotFoundException("product not found or out of stock")
            }
            const cart = await this.CartRepository.findOne({userId:user._id})
            if(!cart){
                return await this.CartRepository.create({products:[{productId,quantity,finalPrice:product.subPrice}],userId:user._id})
            }
            let productExist=cart.products.find(prod=>prod.productId==productId)
            if(productExist){
                throw new BadRequestException('product already exist in cart')
            }
            cart.products.push({productId,quantity,finalPrice:product.subPrice})
            cart.save()

            return {cart}
        }
        async removeFromCart(body:removeFromCartDto,user:UserDocument){
            const {productId}=body
            const product =await this.ProductRepository.findOne({_id:productId})
            if(!product){
                throw new NotFoundException("product not found")
            }
            const cart = await this.CartRepository.findOne({userId:user._id, "products.productId":productId})
            if(!cart){
                throw new NotFoundException("cart or product not found")
            }

            cart.products=cart.products.filter(prod=>prod.productId!=productId)

            cart.save()
            
            return {cart}
        }
        async clearCart(user:UserDocument){
           
            const cart = await this.CartRepository.findOne({userId:user._id})
            if(!cart){
                throw new NotFoundException("cart or product not found")
            }

            cart.products=[]

            cart.save()
            
            return {cart}
        }
        async updateQuantityCart(body:cartDto,user:UserDocument){
            const {productId,quantity}=body

            const cart = await this.CartRepository.findOne({userId:user._id, "products.productId":productId})
            if(!cart){
                throw new NotFoundException("cart or product not found")
            }
            let productInCart=cart.products.find(p=>p.productId==productId)
            if(!productInCart){
                throw new NotFoundException("product not found incart")
            }
            const product =await this.ProductRepository.findOne({_id:productId,stock:{$gte:quantity}})
            if(!product){
                throw new NotFoundException("product not found or out of stock")
            }

            productInCart.quantity=quantity
            cart.save()
            
            return {cart}
        }
        async getCart(user:UserDocument){
            const cart = await this.CartRepository.find({filter:{userId:user._id},populate:[{path:'products.productId',populate:[{path:"category"}]}]})
            return{cart}
        }
}
