import express from 'express';
import { CategoriesEntity } from '../../entities/categories';

const router =express.Router();


router.delete("/categories/:id", async (req,res)=>{
    const {id}=req.params;
    if(id == null) return res.status(400).json({message:'no-category-id-given'})
    const response = await CategoriesEntity.delete(parseInt(id));

    return res.json(response)
})

export { router as deleteCategoryrouter}