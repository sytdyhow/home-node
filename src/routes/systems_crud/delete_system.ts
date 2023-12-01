import express from 'express';
import { SystemsEntity } from "../../entities/systems-entity"

const router =express.Router();


router.delete("/system/:systemId", async (req,res)=>{
    const {systemId}=req.params;

    const response=await SystemsEntity.delete(parseInt(systemId));

    return res.json(response)
})

export { router as deleteSystemrouter}