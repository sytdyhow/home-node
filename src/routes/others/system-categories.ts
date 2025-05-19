import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SystemCategoriesEntity } from "../../entities/systems-categories";

const router = express.Router();

router.put('/system-categories/:system_id', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  if(req.params?.system_id == null) return res.status(400).json({message:'no-system-id-given'})
  const system_id = parseInt(req.params.system_id);

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const user_id = decodedToken.id;

    const user = await UsersEntity.findOneBy({id:user_id});    

    if (user?.roles_id === 0) {
      const { old_category_id, new_category_id } = req.body;

      try {
        const oldCategory = await SystemCategoriesEntity.findOneBy({ system_id, category_id: old_category_id, user_id });
        if (oldCategory != null) {
          await SystemCategoriesEntity.delete(oldCategory.id);
        }
        const newCategory = SystemCategoriesEntity.create({ system_id, category_id: new_category_id, user_id });
        await newCategory.save();
       
        return res.json({
          success: true,
          body: newCategory,
        });
      } catch (error) {
        console.error(error);     
        return res.status(500).json({ error: 'Failed to create system' });
      }
    }

    return res.json({ error: "Only admin can do this operation" });
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
});

export {
  router as SystemCategoryRouter
};