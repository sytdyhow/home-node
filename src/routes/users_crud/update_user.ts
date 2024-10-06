import express from "express";
import { RolesEntity } from "../../entities/roles-entity";
import { SystemsEntity } from "../../entities/systems-entity";
import { UsersEntity } from "../../entities/users-entity";
import { UsersSystemsEntity } from "../../entities/users-systems-entity";
import * as bcrypt from "bcrypt";
import { In } from "typeorm";

const router = express.Router();

router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    confirm,
    is_active,
    systems,
    roles_id,
  } = req.body;

  try {
    const user = await UsersEntity.findOne({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    else {
      if (!username) return res.status(400).json({ error: 'Username is required' });
      if (!systems || systems.length === 0) return res.status(400).json({ error: 'System ID is required' });
      if (roles_id == null) return res.status(400).json({ error: 'Roles ID is required' });
      if (typeof password !== "undefined" && typeof confirm !== "undefined")
        if (password === confirm) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(confirm, salt);
          user.password = hashedPassword;
        } else return res.status(400).json({ error: 'Passwords do not match' });

      user.username = username;
      user.is_active = is_active;
      user.roles_id = roles_id;

      await user.save();

      await UsersSystemsEntity.delete({
        user_id: Number(id)
      })
      
      const newUsersSystemsArray = systems.map((system: any) => {
        return {
          user_id: id,
          system_id: system.id,
          role_id: system.system_role_id
        }
      })

      await UsersSystemsEntity.save(newUsersSystemsArray);

      return res.json({
        success: true,
        body: {
          id: user.id,
          username: user.username,
          roles_id: user.roles_id,
          systems,
          is_active: user.is_active,
          data_joined: user.data_joined
        }, 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user information', message: error });
  }
});

export { router as updateUserRouter };