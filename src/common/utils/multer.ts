import { BadRequestException } from "@nestjs/common"
import { Request } from "express"
import { existsSync, mkdirSync } from "fs"
import { diskStorage } from "multer"
import { resolve } from "path"

interface multerOptions{
    filePath:string,
    allowedExtentions:string[]
}
interface multerOption{
    allowedExtentions:string[]
}

export const MulterLocal=({filePath='generals',allowedExtentions}:multerOptions)=>{
    const storage =diskStorage({
        destination:(req:Request,file: Express.Multer.File,cb:Function)=>{
            const destPath=resolve(`uplodes/${filePath}`)
            if(!existsSync(destPath)){
                mkdirSync(destPath,{recursive:true})
            }
            cb(null,destPath)
        },filename:(req:Request,file: Express.Multer.File,cb:Function)=>{
            const filename= `${Date.now()}-${file.originalname}`
            cb(null,filename)
        }
    })
    const fileFilter =(req:Request,file: Express.Multer.File,cb:Function)=>{
        if(!allowedExtentions.includes(file.mimetype)){
            cb(new BadRequestException('unallowed file'))
        }
        cb(null,true)
    }
    return {storage,fileFilter}
}

export const MulterHost=(allowedExtentions:string[])=>{
   const storage= diskStorage({})
    const fileFilter =(req:Request,file: Express.Multer.File,cb:Function)=>{
        if(!allowedExtentions.includes(file.mimetype)){
            cb(new BadRequestException('unallowed file'))
        }
        cb(null,true)
    }
    return {storage,fileFilter}
}