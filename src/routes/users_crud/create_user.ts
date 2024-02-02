import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import * as bcrypt from 'bcrypt'
import { SystemsEntity } from "../../entities/systems-entity";
import { RolesEntity } from "../../entities/roles-entity";
import { getRepository } from "typeorm";
import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.post('/users', async (req, res) => {



  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Only user type admin can do this operation" });
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
      
  const {
    username,
    password,
    is_active,
    system,
    role,
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is missing. Please provide a username." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is missing. Please provide a password." });
  }

  if (!system || system.length === 0) {
    return res.status(400).json({ error: "Systems are missing. Please provide system IDs." });
  }

  if (!role || role.length ===0) {
    return res.status(400).json({ error: "Roles are missing. Please provide role IDs." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const systemsArray = await SystemsEntity.find();
  const systemObjectArray = system.map((system_id:any)=>systemsArray.find((inArraySystem)=>system_id===inArraySystem.id))

  const user = UsersEntity.create({
    username: username,
    password: hashedPassword, 
    is_active: is_active,
    data_joined: new Date(),
    roles_id: role,
    systems:systemObjectArray
  });
  
   
  
    const roles = await RolesEntity.find()
    const roleObject = roles.find((role)=>user.roles_id===role.id)
  try {
    await user.save();
    return res.json({
      success: true,
      body: {
        id: user.id, 
        username: username,
        is_active: is_active,
        data_joined: new Date(),
        role: roleObject,
        systems:systemObjectArray,
        
      },
    });
  } catch (error) {
     // Check if the error is a duplicate entry error
     if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Username is already taken. Please choose a different username." });
    }

    // Return a generic error message for other types of errors
    return res.status(500).json({ error: "An error occurred while creating the user." });
  }

      }


    return res.json({results: []});
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  

});


export {
  router as createUserRouter 
};