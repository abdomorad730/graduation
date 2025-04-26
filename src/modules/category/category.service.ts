import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { categoryDto } from './Dto/category.dto';
import { UserDocument } from 'src/DB/models';
import { CategoryRepository } from 'src/DB/repository';
import { UploadedFileService } from 'src/common/service/uploadService';
import { Types } from 'mongoose';
import slugify from 'slugify';


@Injectable()
export class CategoryService {
    constructor(
        private readonly CategoryRepository: CategoryRepository,
        private readonly UploadedFileService: UploadedFileService,

    ) { }

   async createCategory(body:categoryDto,user:UserDocument,file:Express.Multer.File){
        const {name}=body
        const categoryExist = await this.CategoryRepository.findOne({name:name.toLowerCase()})
        if(categoryExist){
            throw new ForbiddenException('category already exist')
        }
        let dummyData={name,userId:user._id}
        const customId=Math.random().toString(36).substring(2,7)
        if(file){
           const{secure_url,public_id} =await this.UploadedFileService.uploadFile(file,{folder:`${process.env.folder}/category/${customId}`})
           dummyData["image"]={secure_url,public_id}
           dummyData["customId"]=customId

        }
        const category = await this.CategoryRepository.create(dummyData)
        return {category}

    }
    async UpdateCategory(body:categoryDto,user:UserDocument,file:Express.Multer.File,id:Types.ObjectId){
        const {name}=body
        const category = await this.CategoryRepository.findOne({_id:id,userId:user._id})
        if(!category){
            throw new ForbiddenException('category not exist')
        }

        if(name){
            if(await this.CategoryRepository.findOne({name})){
                throw new ForbiddenException('category already exist')
            }
            category.name=name
            category.slug=slugify(name,{replacement:'-',trim:true,lower:true,})
        }
        
        if(file){
            await this.UploadedFileService.deleteFile(category.image['public_id'])
           const{secure_url,public_id} =await this.UploadedFileService.uploadFile(file,{folder:`${process.env.folder}/category/${category.customId}`})
           category.image={secure_url,public_id}
        
        }
        await category.save();
        return {category}

    }
    async DeleteCategory(user:UserDocument,id:Types.ObjectId){
        const category = await this.CategoryRepository.findOneAndDelete({_id:id,userId:user._id})
        if(!category){
            throw new NotFoundException('category not found')
        }
        if(category?.image){
            await this.UploadedFileService.deleteFolder(`${process.env.folder}/category/${category.customId}`)

        }
        return {category}

    }
    async getAllCategory(){
        const categories=await this.CategoryRepository.find({})
        return {categories}
    }
}
