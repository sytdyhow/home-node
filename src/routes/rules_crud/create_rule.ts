import express from "express"
import { RulesEntity } from "../../entities/rules-entity";

const router =express.Router();

  router.post('/rules',async (req,res)=>{
    const{

     ruleName,
     severity_in,
     severity_out,
     application,
     keywords,
     index,
     splitter,
     description,
      
    }=req.body;

    const rules= RulesEntity.create({
    ruleName:ruleName,
     severity_in:severity_in,
     severity_out:severity_out,
     application:application,
     keywords:keywords,
     index:index,
     splitter:splitter,
     description:description,
    })
    await rules.save();
    return res.json(rules)
})



export {
    router as createRulerouter
}