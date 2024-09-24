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
      const users_id = decodedToken.id;
  
  
        const role_id = await getRepository(UsersEntity)
        .createQueryBuilder('users')
        .select(['users.roles_id'])
        .where('users.id = :id', { id: users_id })
        .getOne();
  
     
  
  
      const role = await getRepository(RolesEntity)
        .createQueryBuilder('roles')
        .leftJoin('users', 'rol', 'roles.id = rol.roles_id')
        .where('rol.id = :id', { id: users_id })
        .getMany();
        
        const roleId=role[0].id;
        const rolename=role[0].name


        if(role_id?.roles_id===roleId && rolename==="admin"){
          const systems = await SystemsEntity.find();
          // const activeSystems = systems.filter((system) => system.is_active === true);
          return res.send({results: systems});

        }


      return res.json({results: []});
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
    




 
});

export { router as getSystemrouter };