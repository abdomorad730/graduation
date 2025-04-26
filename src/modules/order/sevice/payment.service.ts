import { Injectable } from "@nestjs/common";
import {Stripe} from 'stripe'

@Injectable()
export class paymentService{
    constructor(){}
    private readonly stripe=new Stripe(process.env.stripe_key as string)

    async createCheckoutSession({customer_email,metadata,success_url,cancel_url,line_items,discounts}){
        return await this.stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:"payment",
            customer_email,
            metadata,
            success_url,
            cancel_url,
            line_items,
            discounts
        })
    }
    async createCoupon(percent_off:number){
        return await this.stripe.coupons.create({
            percent_off,
            duration:"once"
        })
    }
    async refunded({payment_intent,reason}){
        return await this.stripe.refunds.create({
            payment_intent,
            reason
        })
    }
}