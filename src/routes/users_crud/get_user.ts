

import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();

router.get('/users', async (req, res) => {
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
});

export { router as getUserRouter };