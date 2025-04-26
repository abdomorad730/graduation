import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UploadedFileService } from 'src/common/service/uploadService';
import { BrandRepository, CategoryRepository } from 'src/DB/repository';
import { brandDto, updateBrandDto } from './dto/brand.dto';
import { UserDocument } from 'src/DB/models';
import { Types } from 'mongoose';
import slugify from 'slugify';

@Injectable()
export class BrandService {
    constructor(
        private readonly CategoryRepository: CategoryRepository,
        private readonly BrandRepository: BrandRepository,
        private readonly UploadedFileService: UploadedFileService,

    ) { }
       async createBrand(body:brandDto,user:UserDocument,file:Express.Multer.File){
            const {name,category}=body
            const BrandExist = await this.BrandRepository.findOne({name:name.toLowerCase()})
            if(BrandExist){
                throw new ForbiddenException('Brand already exist')
            }
            if(!await this.CategoryRepository.findOne({_id:category})){
                throw new NotFoundException('category not found')
            }
            const customId=Math.random().toString(36).substring(2,7)
            let dummyData={name,userId:user._id,category,customId}


            if(file){
               const{secure_url,public_id} =await this.UploadedFileService.uploadFile(file,{folder:`${process.env.folder}/Brands/${customId}`})
               dummyData["image"]={secure_url,public_id}
    
            }
            const Brand = await this.BrandRepository.create(dummyData)
            return {Brand}
    
        }
        async UpdateBrand(body:updateBrandDto,user:UserDocument,file:Express.Multer.File,id:Types.ObjectId){
            const {name}=body
            const Brand = await this.BrandRepository.findOne({_id:id,userId:user._id})
            if(!Brand){
                throw new ForbiddenException('Brand not exist')
            }
    
            if(name){
                if(await this.BrandRepository.findOne({name})){
                    throw new ForbiddenException('Brand already exist')
                }
                Brand.name=name
                Brand.slug=slugify(name,{replacement:'-',trim:true,lower:true,})
            }
            
            if(file){
                await this.UploadedFileService.deleteFile(Brand.image['public_id'])
               const{secure_url,public_id} =await this.UploadedFileService.uploadFile(file,{folder:`${process.env.folder}/Brands/${ Brand.customId}`})
               Brand.image={secure_url,public_id}
            
            }
            await Brand.save();
            return {Brand}
    
        }
        async DeleteBrand(user:UserDocument,id:Types.ObjectId){
            const Brand = await this.BrandRepository.findOneAndDelete({_id:id,userId:user._id})
            if(!Brand){
                throw new NotFoundException('Brand not found')
            }
            if(Brand?.image){
                await this.UploadedFileService.deleteFolder(`${process.env.folder}/Brands/${Brand.customId}`)
    
            }
            return {Brand}
    
        }
        async getAllBrand(){
            const brands=await this.BrandRepository.find({})
            return {brands}
        }
}
