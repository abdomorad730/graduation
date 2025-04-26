import { Injectable, Options } from "@nestjs/common";
import { cloudinaryConfig } from "../cloudnairy/cloudnairy";
import { UploadApiOptions } from "cloudinary";


@Injectable()
export class UploadedFileService{
    constructor(){}
    private  cloudnairy=cloudinaryConfig()

    async uploadFile(file:Express.Multer.File,options:UploadApiOptions){
        return await this.cloudnairy.uploader.upload(file.path,options)
    }
    async uploadFiles(files:Express.Multer.File[],options:UploadApiOptions){
        let result:{secure_url:string,public_id:string}[]=[];
        for (const element of files) {
            const{secure_url,public_id}=await this.uploadFile(element,options)
            result.push({secure_url,public_id})  
        }
        return result
    }
    async deleteFile(public_id:string){
        return await this.cloudnairy.uploader.destroy(public_id)
    }
    async deleteFolder(filePath:string){
         await this.cloudnairy.api.delete_resources_by_prefix(filePath)
         await this.cloudnairy.api.delete_folder(filePath)

    }
}