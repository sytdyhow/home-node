

import express from "express";
import { UsersEntity } from "../../entities/users-entity";

const router = express.Router();

router.get('/users', async (req, res) => {
  const users = await UsersEntity.find({
    // where: {
    //   is_active: true
    // },
    relations: ["systems"]
  });

  const activeUsers = users.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return {
      id: user.id,
      username: userWithoutPassword.username,
      is_active: userWithoutPassword.is_active,
      data_joined: userWithoutPassword.data_joined,
      systems: userWithoutPassword.systems,
      roles_id: userWithoutPassword.roles_id,
    };
  });

  return res.send({results: activeUsers});
});

export { router as getUserRouter };