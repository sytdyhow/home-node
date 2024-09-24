import express from "express";
import { RolesEntity } from "../../entities/roles-entity";
import { getRepository } from "typeorm";
import { UsersEntity } from "../../entities/users-entity";
import jwt, { JwtPayload } from "jsonwebtoken";

const router =express.Router();


router.get ('/roles',async (req,res)=>{

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
            const roles =await RolesEntity.find();
            return res.send({results:roles})
        
        }

      return res.json({results: []});
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
   
});

export { router as getRolerouter}