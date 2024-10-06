import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import * as bcrypt from 'bcrypt'
import { SystemsEntity } from "../../entities/systems-entity";
import { RolesEntity } from "../../entities/roles-entity";
import { getRepository, In } from "typeorm";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UsersSystemsEntity } from "../../entities/users-systems-entity";

const router = express.Router();

router.post('/users', async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, 'system') as JwtPayload;
    const user_id = decodedToken.id;

    const user = await UsersEntity.findOneBy({id:user_id})

    if (user?.roles_id === 0) {
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

      if (role == null) {
        return res.status(400).json({ error: "Roles are missing. Please provide role IDs." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const systemsArray = await SystemsEntity.find({
        where: {
          id: In(system.map((system: any) => system.system_id))
        }
      });
      console.log("systemsArray",systemsArray);
      
      try {
        const user = UsersEntity.create({
          username: username,
          password: hashedPassword,
          is_active: is_active,
          data_joined: new Date(),
          roles_id: role,
        });
        console.log("user:",user);
        
        const savedUser = await user.save();
        console.log("savedUser", savedUser);

        const newUsersSystemsArray = system.map((system: any) => {
          return {
            user_id: savedUser.id,
            system_id: system.system_id,
            role_id: system.role_id
          }
        })

        const createdUsersSystems = await UsersSystemsEntity.save(newUsersSystemsArray);
        console.log("createdUsersSystems", createdUsersSystems);

        const { password, ...body } = savedUser
        return res.json({
          success: true,
          body: {
            ...body,
            systems: systemsArray.map((sys)=>{
              return {
                ...sys,
                system_role_id: system?.find((s:any)=>s.system_id === sys.id)?.role_id
            }}),
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

    return res.json({ error: "Only admin can do this operation" });
  } catch (error) {
    return res.status(400).json({ error });
  }


});


export {
  router as createUserRouter
};