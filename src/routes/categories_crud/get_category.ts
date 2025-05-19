import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UsersEntity } from "../../entities/users-entity";
import { CategoriesEntity } from "../../entities/categories";

const router = express.Router();

router.get('/categories', async (req, res) => {

  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const user_id = decodedToken.id;

    const user = await UsersEntity.findOneBy(({id:user_id}))

    if (user != null) {
      const categories = await CategoriesEntity.findBy({user_id});
      return res.send({ results: categories });
    }
    
    return res.json({ results: [] });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

export { router as getCategoryrouter };