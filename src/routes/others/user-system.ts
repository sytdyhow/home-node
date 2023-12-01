import express from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { UsersEntity } from "../../entities/users-entity";
import { SystemsEntity } from "../../entities/systems-entity";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();
router.get('/user-system', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1]!;
  const decodedToken = jwt.verify(token, 'system') as JwtPayload;
  const users_id = decodedToken.id;

  const systems = await getRepository(SystemsEntity)
    .createQueryBuilder('systems')
    .innerJoin('users_systems', 'us', 'systems.id = us.system_id')
    .where('us.user_id = :id', { id: users_id }) 
    .getMany();




    const userMenu =
      {
       label: "Admin Panel",
       link:"admin-panel/users",
       icon:""
      }


     
      const user = await getRepository(UsersEntity)
      .createQueryBuilder('users')
      .select(['users.username'])
      .where('users.id = :id', { id: users_id })
      .getOne();
    
    const role = await getRepository(RolesEntity)
      .createQueryBuilder('roles')
    //   .select(['roles.name'])
      .innerJoin('users_roles','rol','roles.id=rol.roles_id')
      .where('rol.users_id = :id', { id: users_id })
       .getMany();
    
    const userDetails = {
     user,role
    };





        return res.json({systems,userMenu,userDetails});
  
});

export {
  router as UserSystemRouter
};