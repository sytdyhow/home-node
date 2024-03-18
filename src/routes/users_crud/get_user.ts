

import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import { RolesEntity } from "../../entities/roles-entity";
import { createQueryBuilder, getRepository } from "typeorm";
import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();


router.get('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const repo = await getRepository(UsersEntity)
      .createQueryBuilder('users')
      .select(['users.id', 'users.username'])
      .where('users.id = :id', { id })
      .getOne();

    if (!repo) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ results: repo });
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/admins',async (req ,res)=>{
  try{
    const  roles=await getRepository(RolesEntity)
    .createQueryBuilder('roles')
    .select(['roles.id'])
    .where('roles.name=:name',{name:'admin'})
    .getOne();

    const id =roles?.id

    if (!roles) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const user =await getRepository(UsersEntity)
    .createQueryBuilder('users')
    .select(['users.id','users.username'])
    .where('users.roles_id=:id',{id:id})
    .getMany();
  
    return res.json({ results: user });
  }catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
})



router.get('/users', async (req, res) => {

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
       
  const users = await UsersEntity.find({
    // where: {
    //   is_active: true
    // },
    relations: ["systems"]
  });

  const roles = await RolesEntity.find()

  const activeUsers = users.map((user) => {
    const { password, ...userWithoutPassword } = user;
    const role = roles.find((role)=>userWithoutPassword.roles_id===role.id)
    return {
      id: user.id,
      username: userWithoutPassword.username,
      is_active: userWithoutPassword.is_active,
      data_joined: userWithoutPassword.data_joined,
      systems: userWithoutPassword.systems,
      role: role,
    };
  });

  return res.send({results: activeUsers});

      }

    return res.json({results: []});
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  
});



export { router as getUserRouter };
