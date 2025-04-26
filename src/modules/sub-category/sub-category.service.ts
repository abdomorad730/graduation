import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UploadedFileService } from 'src/common/service/uploadService';
import { CategoryRepository, SubCategoryRepository } from 'src/DB/repository';
import { subCategoryDto, updateSubCategoryDto } from './dto/subCategoryDto';
import { UserDocument } from 'src/DB/models';
import { Types } from 'mongoose';
import slugify from 'slugify';

@Injectable()
export class SubCategoryService {constructor(
        private readonly CategoryRepository: CategoryRepository,
        private readonly SubCategoryRepository: SubCategoryRepository,
        private readonly UploadedFileService: UploadedFileService,

    ) { }
       async createSubCategory(body:subCategoryDto,user:UserDocument,file:Express.Multer.File){
            const {name,category}=body
            const categoryExist=await this.CategoryRepository.findOne({_id:category})
            const SubCategoryExist = await this.SubCategoryRepository.findOne({name:name.toLowerCase()})
            if(SubCategoryExist){
                throw new ForbiddenException('SubCategory already exist')
            }
            if(!categoryExist){
                throw new NotFoundException('category not found')
            }
            let dummyData={name,userId:user._id,category}


            if(file){
               const{secure_url,public_id} =await this.UploadedFileService.uploadFile(file,{folder:`${process.env.folder}/category/${categoryExist.customId}/subCategories`})
               dummyData["image"]={secure_url,public_id}
    
            }
            const SubCategory = await this.SubCategoryRepository.create(dummyData)
            return {SubCategory}
    
        }
        async UpdateSubCategory(body:updateSubCategoryDto,user:UserDocument,file:Express.Multer.File,id:Types.ObjectId){
            const {name}=body
            const SubCategory = await this.SubCategoryRepository.findOne({_id:id,userId:user._id})
            if(!SubCategory){
                throw new ForbiddenException('SubCategory not exist')
            }
            const categoryExist=await this.CategoryRepository.findOne({_id:SubCategory.category})

            if(name){
                if(await this.SubCategoryRepository.findOne({name})){
                    throw new ForbiddenException('SubCategory already exist')
                }
                SubCategory.name=name
                SubCategory.slug=slugify(name,{replacement:'-',trim:true,lower:true,})
            }
            
            if(file){
                await this.UploadedFileService.deleteFile(SubCategory.image['public_id'])
               const{secure_url,public_id} =await this.UploadedFileService.uploadFile(file,{folder:`${process.env.folder}/category/${categoryExist?.customId}/subCategories`})
               SubCategory.image={secure_url,public_id}
            
            }
            await SubCategory.save();
            return {SubCategory}
    
        }
        async DeleteSubCategory(user:UserDocument,id:Types.ObjectId){
            const SubCategory = await this.SubCategoryRepository.findOneAndDelete({_id:id,userId:user._id})
            if(!SubCategory){
                throw new NotFoundException('SubCategory not found')
            }
            const categoryExist=await this.CategoryRepository.findOne({_id:SubCategory.category})

            if(SubCategory?.image){
                await this.UploadedFileService.deleteFolder(`${process.env.folder}/category/${categoryExist?.customId}/subCategories`)
    
            }
            return {SubCategory}
    
        }
        async getAllSubCategory(id:Types.ObjectId){
            const subCategories=await this.SubCategoryRepository.find({filter:{category:id},populate:[{path:'category'}]})
            return {subCategories}
        }}
