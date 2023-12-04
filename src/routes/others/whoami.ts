import express from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RolesEntity } from "../../entities/roles-entity";
import { UsersEntity } from "../../entities/users-entity";
import { getRepository } from "typeorm";

const router = express.Router();
router.get('/whoami', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1]!;
  const decodedToken = jwt.verify(token, 'system') as JwtPayload;
  const users_id = decodedToken.id;

   
  const user = await getRepository(UsersEntity)
  .createQueryBuilder('users')
  .select(['users.id','users.username'])
  .where('users.id = :id', { id: users_id })
  .getOne();

const role = await getRepository(RolesEntity)
  .createQueryBuilder('roles')
//   .select(['roles.name'])
  .innerJoin('users_roles','rol','roles.id=rol.roles_id')
  .where('rol.users_id = :id', { id: users_id })
   .getMany();

// const userDetails = {
//  user,role
// };

  



        return res.json({user,role});
  
});

export {
  router as Whoami
};