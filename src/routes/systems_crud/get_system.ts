import express from "express";
import { SystemsEntity } from "../../entities/systems-entity";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { UsersEntity } from "../../entities/users-entity";
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();

router.get('/systems', async (req, res) => {

  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const user_id = decodedToken.id;

    const user = await UsersEntity.findOneBy(({id:user_id}))

    if (user?.roles_id === 0) {
      const systems = await SystemsEntity.find();
      // const activeSystems = systems.filter((system) => system.is_active === true);
      return res.send({ results: systems });
    }


    return res.json({ results: [] });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

export { router as getSystemrouter };