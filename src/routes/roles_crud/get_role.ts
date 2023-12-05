import express from "express";
import { RolesEntity } from "../../entities/roles-entity";

const router =express.Router();


router.get ('/roles',async (req,res)=>{
    const roles =await RolesEntity.find();
    return res.send({results:roles})

})
export { router as getRolerouter}