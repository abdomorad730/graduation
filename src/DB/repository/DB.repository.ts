import { FilterQuery, Model, PopulateOptions, Promise } from "mongoose";
interface findOptions<td>{
    filter?:FilterQuery<td>,
    populate?:PopulateOptions[],
    select?:string,
    sort?:string,
    page?:number

}

export abstract class repository<td>{
    constructor(private readonly model:Model<td>){}

    async  create(data:Partial<td>):Promise<td> {
        return  this.model.create(data)  
    }
    async  findOne(query:FilterQuery<td>,populate?:PopulateOptions[],select?:string):Promise<td | null> {
         const x= this.model.findOne(query)
         if(populate){
            x.populate(populate)
         }
         if(select){
            x.select(select)
         }

         return await x

    }
    async  find({filter={},populate,page,select,sort}:findOptions<td>):Promise<td[] |[]> {
        const query= this.model.find(filter) 
        if(populate){
             query.populate(populate)
        }
        if(select){
             query.select(select)
        }
        if(sort){
             query.sort(sort)
        }
        if(!page){
            return await query 
        }
        const limit =2
        const skip=(page-1)*limit
        const result =await query.skip(skip).limit(limit)
        return result
    }
    
    async  findOneAndUpdate(query:FilterQuery<td> ,data:any ):Promise<td | null> {
        return  this.model.findOneAndUpdate(query,data,{new:true})  
    }
    async  findOneAndDelete(query:FilterQuery<td> ):Promise<td | null> {
        return  this.model.findOneAndDelete(query)  
    }
}