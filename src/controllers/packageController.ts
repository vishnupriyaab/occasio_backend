import { Request, Response } from "express";

export class PackageController{
    constructor(){}
    async addPackage(req:Request,res:Response){
        try {
            console.log(req.body,"1111111111111",req.file,"req.bodyyyy")
        } catch (error) {
            
        }
    }
}