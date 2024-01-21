import express from "express";
import { RolesEntity } from "../../entities/roles-entity";
import { SystemsEntity } from "../../entities/systems-entity";
import { UsersEntity } from "../../entities/users-entity";
import * as bcrypt from "bcrypt";

const router = express.Router();

router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    confirm,
    is_active,
    systems,
    role,
  } = req.body;

  try {
    const user = await UsersEntity.findOne({ where: { id: Number(id) } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } else {
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      if (!confirm) {
        return res.status(400).json({ error: 'Confirmation password is required' });
      }

      if (!systems || systems.length === 0) {
        return res.status(400).json({ error: 'System ID is required' });
      }

      if (!role || role.length ===0) {
        return res.status(400).json({ error: 'Roles ID is required' });
      }

      if (password === confirm) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(confirm, salt);

        user.username = username;
        user.password = hashedPassword;
        user.is_active = is_active;

        user.systems = systems.map((systemm: number) => {
          const entity = new SystemsEntity();
          entity.id = systemm;
          return entity;
        });

        const roles = await RolesEntity.find()
        const roleObject = roles.find((role)=>user.roles_id===role.id)

        user.roles_id = role;
        

        await user.save();

        return res.json({
          success: true,
          body: {
            id:user.id,
            username: user.username,
            role: roleObject,
            systems:user.systems,
            is_active: user.is_active,
            data_joined: user.data_joined
          },
        });
      } else {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user information' });
  }
});

export { router as updateUserRouter };