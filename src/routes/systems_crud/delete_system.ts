import express from 'express';
import { SystemsEntity } from "../../entities/systems-entity"

const router =express.Router();


router.delete("/systems/:id", async (req,res)=>{
    const {id}=req.params;

    const response=await SystemsEntity.delete(parseInt(id));

    return res.json(response)
})

export { router as deleteSystemrouter}