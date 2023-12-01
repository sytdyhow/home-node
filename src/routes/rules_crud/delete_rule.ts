import express from 'express';
import { RulesEntity } from '../../entities/rules-entity';

const router =express.Router();


router.delete("/rule/:ruleId", async (req,res)=>{
    const {ruleId}=req.params;

    const response=await RulesEntity.delete(parseInt(ruleId));

    return res.json(response)
})

export { router as deleteRulerouter}