import express from 'express';
import { SystemsEntity } from "../../entities/systems-entity"
import { PermissionsEntity } from '../../entities/permissions-entity';
import { PermissionsSystemsEntity } from '../../entities/permissions-systems-entity';
import { PermissionContentEntity } from '../../entities/permission-content-entity';

const router =express.Router();


router.delete("/permissions/:id", async (req,res)=>{
    try {
        const {id}=req.params;
    
        // const response=await SystemsEntity.delete(parseInt(id));
        await PermissionsSystemsEntity.delete({permission_id: parseInt(id)});
        await PermissionContentEntity.delete({permission_id: parseInt(id)});
        const deletedPermission = await PermissionsEntity.delete(parseInt(id));
        
        return res.json(deletedPermission)
    } catch (error) {   
        return res.status(502).json(error);
    }
})

export { router as deletePermissionrouter}