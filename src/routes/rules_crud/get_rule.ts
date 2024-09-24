import express from "express";
import { RulesEntity } from "../../entities/rules-entity";

const router =express.Router();


router.get ('/rule',async (req,res)=>{
    const rules =await RulesEntity.find();
    return res.json(rules)

})
export { router as getRulerouter}