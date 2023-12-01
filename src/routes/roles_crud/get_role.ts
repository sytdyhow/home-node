import express from "express";
import { RolesEntity } from "../../entities/roles-entity";

const router =express.Router();


router.get ('/role',async (req,res)=>{
    const roles =await RolesEntity.find();
    return res.json(roles)

})
export { router as getRolerouter}