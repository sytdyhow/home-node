import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import LogsDatasource from "../../database/logsdb";
import { PairsEntity } from "../../entities/pairs_entity";
import { RulesEntity } from "../../entities/rules-entity";
import { getRepository } from "typeorm";
import { UsersEntity } from "../../entities/users-entity";
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();

router.get('/roles-users', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const users_id = decodedToken.id;

   

    const role = await getRepository(RolesEntity)
      .createQueryBuilder('roles')
      .leftJoin('users', 'rol', 'roles.id = rol.roles_id')
      .where('rol.id = :id', { id: users_id })
      .getMany();

const roll= role.map((rl)=>rl.id);


const users= await getRepository(UsersEntity)
.createQueryBuilder('users')
.innerJoin('users_roles','ur','users.id=ur.users_id')
.where('ur.roles_id=:id',{id:roll})
.getMany();

// console.log(users);

const userr= users.map((us)=> {
  return { id:us.id,
          name:us.username
         };   
  });


    return res.json({ userr });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export {
  router as Roles_users
};
