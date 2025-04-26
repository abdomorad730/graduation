import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto, queryDto, updateProductDto } from './Dto/product.Dto';
import { ProductDocument, UserDocument } from 'src/DB/models';
import { UploadedFileService } from 'src/common/service/uploadService';
import { BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository, userRepository } from 'src/DB/repository';
import { FilterQuery, Types } from 'mongoose';
import { date } from 'zod';

@Injectable()
export class ProductService {
    constructor(
        private readonly ProductRepository: ProductRepository,
        private readonly CategoryRepository: CategoryRepository,
        private readonly BrandRepository: BrandRepository,
        private readonly SubCategoryRepository: SubCategoryRepository,
        private readonly userRepository: userRepository,


        private readonly UploadedFileService: UploadedFileService,

    ) { }
    

    async createProduct(body:ProductDto,user:UserDocument,files:{imageCover?: Express.Multer.File[], images?: Express.Multer.File[] }){
        const {name,stock,subCategory,brand,quantity,category,describtion,price,discount,rate,avgRating}=body
        const categoryExist=await this.CategoryRepository.findOne({_id:category})
        
        if(!category){
            throw new NotFoundException('category not found')
        }
        if(!files.imageCover){
            throw new BadRequestException('imegeCover is required')
        }
        if(! await this.BrandRepository.findOne({_id:brand})){
            throw new NotFoundException('brand not found')

        }
        if(! await this.SubCategoryRepository.findOne({_id:subCategory})){
            throw new NotFoundException('subCategory not found')

        }
        
        const customId=Math.random().toString(36).substring(2,7)
        const {secure_url,public_id} =await this.UploadedFileService.uploadFile(files.imageCover[0],{folder:`${process.env.folder}/category/${categoryExist?.customId}/products/${customId}/main_image`})
        let subImages:{secure_url:string,public_id:string}[]=[]
        if(files.images){
            const result = await this.UploadedFileService.uploadFiles(files.images,{folder:`${process.env.folder}/category/${categoryExist?.customId}/products/${customId}/sub_images`})
            subImages.push(...result)
        }
        console.log(subImages)
        console.log(files.images)
        const subPrice=price - (price*((discount || 0) /100))

        const product=await this.ProductRepository.create({
            name,
            describtion,
            category,
            subCategory,
            brand,
            price,
            discount,
            subPrice,
            stock,
            quantity,
            customId,
            imageCover:{secure_url,public_id},
            images:subImages,
            userId:user._id,
            rate,
            avgRating,


        })
        return {product}

    }

    async updateProduct(body:updateProductDto,user:UserDocument,files:{imageCover?: Express.Multer.File[], images?: Express.Multer.File[]},productId:Types.ObjectId ){
        const {name,stock,subCategory,brand,quantity,category,describtion,price,discount,rate,avgRating}=body
        const product=await this.ProductRepository.findOne({_id:productId,userId:user._id})
        if(!product){
            throw new NotFoundException('product not found')

        }
        let categoryExist;
        if(category){
          categoryExist =await this.CategoryRepository.findOne({_id:category})
            if(!categoryExist){
                throw new NotFoundException('category not found')
            }  
        }
       
        
        if(name ){
            if(name==product.name){
                throw new BadRequestException("name is dublicated")
            }
            product.name=name
        }
        if(describtion){
            product.describtion=describtion
        }
        if(files.imageCover){
            await this.UploadedFileService.deleteFile(product.imageCover['public_id'])
            const {secure_url,public_id} =await this.UploadedFileService.uploadFile(files.imageCover[0],{folder:`${process.env.folder}/category/${categoryExist?.customId}/products/${product.customId}/main_image`})
            product.imageCover={secure_url,public_id}
        }
        let subImages:{secure_url:string,public_id:string}[]=[]
        if(files.images){
            await this.UploadedFileService.deleteFolder(`${process.env.folder}/category/${categoryExist?.customId}/products/${product.customId}/sub_images`)
            const result = await this.UploadedFileService.uploadFiles(files.images,{folder:`${process.env.folder}/category/${categoryExist?.customId}/products/${product.customId}/sub_images`})
            subImages.push(...result)
        }

        if(price&&discount){
            product.subPrice=price - (price*((discount || 0) /100))
            product.price=price
            product.discount=discount
        }else if(price){
            product.subPrice=price-(price*((product.discount||0)/100))
            product.price=price
        }else if(discount){
            product.subPrice=product.price-(product.price*((discount||0)/100))
            product.discount=discount
        }
        if(quantity){
            product.quantity=quantity
        }

        if(stock){
            if(stock>quantity){
                throw new ForbiddenException("stock should be less than quantity")
            }
            product.stock=stock

        }
        product.save()

       
        return {product}

    }

    async getAllProducts(query:queryDto){
        const {name,select,sort,page}=query

        let filterObject:FilterQuery<ProductDocument>={}
        if(name){
            filterObject={
                $or:[{name:{$regex:name,$options:'i'}},{slug:{$regex:name,$options:'i'}}]
            }
        }

        const products=await this.ProductRepository.find({filter:filterObject,populate:[{path:'category'},{path:'brand'},{path:'subCategory'}],select,sort,page})
        return {products}
    }
    async addOrdeleteProduct(user:UserDocument,productId:Types.ObjectId){
        const product =await this.ProductRepository.findOne({_id:productId})
        if(!product){
            throw new NotFoundException('product not found')
        }
        if(user.washlist.includes(productId)){
            user.washlist.splice(user.washlist.indexOf(productId),1)
            user.save()
            return{user}
        }
        user.washlist.push(productId)
        user.save()

        return{user}
    }
    async getWashlist(user:UserDocument){
        const washlist =await this.userRepository.findOne({_id:user._id},[{path:'washlist'}],'washlist firstName lastName')
        return{user:washlist}
    }


    async deleteProduct(user:UserDocument,productId:Types.ObjectId ){


        const product =await this.ProductRepository.findOneAndDelete({_id:productId})
        if(!product){
            throw new NotFoundException('product not found')
        }
        const categoryExist =await this.CategoryRepository.findOne({_id:product.category})
        await this.UploadedFileService.deleteFolder(`${process.env.folder}/category/${categoryExist?.customId}/products/${product.customId}`)


       
        return {msg:'done',product}

    }
}
