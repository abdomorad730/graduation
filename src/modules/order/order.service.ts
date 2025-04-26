import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CouponRepository, OrderRepository, ProductRepository } from 'src/DB/repository';
import { CartRepository } from 'src/DB/repository/cart.Repository';
import { orderDto, paymentDto } from './dto/orderDto';
import { UserDocument } from 'src/DB/models';
import { paymentMethods, status } from 'src/common/types/types';
import { paymentService } from './sevice/payment.service';

@Injectable()
export class OrderService {
    constructor(
        private readonly CartRepository: CartRepository,
        private readonly OrderRepository: OrderRepository,
        private readonly CouponRepository: CouponRepository,
        private readonly ProductRepository: ProductRepository,

        private readonly paymentService:paymentService
    ) { }


    async createOrder(body: orderDto, user: UserDocument) {
        const { phone, paymentMethod, address } = body
        const cart = await this.CartRepository.findOne({ userId: user._id })

        if (!cart || cart.products.length == 0) {
            throw new BadRequestException('Cart is empty')
        }
        const order = await this.OrderRepository.create({
            userId: user._id,
            cartId: cart._id,
            phone,
            paymentMethod,
            address,
            TotalPrice: cart.subTotal,
            status: paymentMethod == paymentMethods.cash ? status.placed : status.pending
        })
        for (const element of cart.products) {
            await this.ProductRepository.findOneAndUpdate({_id:element.productId},{$inc:{stock:-element.quantity}})
        }

        cart.products=[]
        cart.save
        return {order}
    }


    async createPaymentWithStripe(body:paymentDto,user:UserDocument){
        const {orderId,code}=body
        const order =await this.OrderRepository.findOne({_id:orderId,userId:user._id,status:status.pending,paymentMethod:paymentMethods.card},[{path:'cartId',populate:[{path:"products.productId"}]}])
        if(!order){
            throw new BadRequestException('order not found')
        }
        if(code){
            const couponExist=await this.CouponRepository.findOne({code,usedBy:{$nin:[user._id]}})
            if(!couponExist){
                throw new NotFoundException('coupon not found')
            }
            if(new Date(couponExist.toDate).getTime() < Date.now()){
                throw new ForbiddenException('coupon is expired')
            }
           const coupon=await this.paymentService.createCoupon(couponExist.amount)
            const data=await this.paymentService.createCheckoutSession({
                customer_email:user.email,
                metadata:{orderId:orderId.toString()},
                success_url:'http://localhost:3000',
                cancel_url:'http://localhost:3000',
                line_items: order.cartId['products'].map(product=>({
                    price_data:{
                        currency:"egp",
                        product_data:{
                            name:product.productId?.name,
                            images:[product.productId?.imageCover.secure_url]
                        },
                        unit_amount:product.productId?.subPrice*100
                    },
                    quantity:product.quantity
                })),
                discounts:[{coupon:coupon.id}]

    
    
    
            })
            couponExist.usedBy.push(user._id)
            couponExist.save()
            return {data}

        }
        const data=await this.paymentService.createCheckoutSession({
            customer_email:user.email,
            metadata:{orderId:orderId.toString()},
            success_url:'http://localhost:3000',
            cancel_url:'http://localhost:3000',
            line_items: order.cartId['products'].map(product=>({
                price_data:{
                    currency:"egp",
                    product_data:{
                        name:product.productId?.name,
                        images:[product.productId?.imageCover.secure_url]
                    },
                    unit_amount:product.productId?.subPrice*100
                },
                quantity:product.quantity
            })),
            discounts:[]




        })
       

        return {data}

    }

    async webhook(data:any){
        const orderId=data.data.object.metadata.orderId
        const order =await this.OrderRepository.findOneAndUpdate({_id:orderId},{status:status.paid,orderChanged:{paidAt:Date.now()},paymentIntent:data.data.object.payment_intent})
        return {order}
    }

    
    async cancelPayment(body:paymentDto,user:UserDocument){
        const{orderId}=body
        const order = await this.OrderRepository.findOneAndUpdate({_id:orderId,status:{$in:[status.pending,status.paid,status.placed]}},{status:status.cancelled,orderChanged:{
            cancelledAt:Date.now(),
            cancelledBy:user._id
        }})
        if(!order){
            throw new NotFoundException('order not found')
        }
        if(order.paymentMethod=='card'){
            await this.paymentService.refunded({payment_intent:order.paymentIntent,reason:"requested_by_customer"})
            order.orderChanged={
                refundedAt:Date.now(),
                refundedBy:user._id
            }
            order.status=status.refunded
            order.save()
        }
        return {msg:'done'}
    }
    async getAllorders(){
        const orders=await this.OrderRepository.find({})
        return {orders}
    }
    
}

