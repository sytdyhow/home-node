import express from 'express';
import { RolesEntity } from '../../entities/roles-entity';

const router =express.Router();


router.delete("/role/:roleId", async (req,res)=>{
    const {roleId}=req.params;

    const response=await RolesEntity.delete(parseInt(roleId));

    return res.json(response)
})

export { router as deleteRolerouter}