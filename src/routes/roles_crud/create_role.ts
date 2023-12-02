import express from "express"
import { RolesEntity } from "../../entities/roles-entity";

const router =express.Router();

  router.post('/roles',async (req,res)=>{
    const{ name }=req.body;

    const roles= RolesEntity.create({
        name:name
   
    })
    await roles.save();
    return res.json(roles)
})



export {
    router as createRolerouter
}