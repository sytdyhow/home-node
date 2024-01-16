import express from "express"
import { RulesEntity } from "../../entities/rules-entity";

const router =express.Router();

  router.post('/rules',async (req,res)=>{
    const{
      rule_name,
      severity_in,
      severity_out,
      application,
      keywords,
      description,
    }=req.body;
  
    const rules= RulesEntity.create({
      rule_name:rule_name,
      severity_in:severity_in,
      severity_out:severity_out,
      application:application,
      keywords:keywords,
      description:description,
    })
    await rules.save();
    return res.json(rules)
  })
  



export {
    router as createRulerouter
}