import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import LogsDatasource from "../../database/logsdb";
import { PairsEntity } from "../../entities/pairs_entity";
import { RulesEntity } from "../../entities/rules-entity";
import { getRepository } from "typeorm";
import { UsersEntity } from "../../entities/users-entity";
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();

router.get('/whoami', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const users_id = decodedToken.id;

    const user = await getRepository(UsersEntity)
      .createQueryBuilder('users')
      .select(['users.id', 'users.username'])
      .where('users.id = :id', { id: users_id })
      .getOne();


      
    const userMenu = {
      label: "Admin Panel",
      link: "/admin-panel/users",
      icon: ""
    }


    const role = await getRepository(RolesEntity)
      .createQueryBuilder('roles')
      .innerJoin('users_roles', 'rol', 'roles.id = rol.roles_id')
      .where('rol.users_id = :id', { id: users_id })
      .getMany();

    return res.json({ user, role,userMenu });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  
});

export {
  router as Whoami
};
