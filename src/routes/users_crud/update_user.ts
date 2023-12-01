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
    is_active,
    systemId,
    rolesId,
    newPassword
  } = req.body;

  try {
    const user = await UsersEntity.findOne({ where: { id: Number(id) } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } else {
      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        return res.status(400).json({ error: 'User password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.username = username;
      user.password = hashedPassword;
      user.is_active = is_active;

      user.systems = systemId.map((systemm: number) => {
        const entity = new SystemsEntity();
        entity.id = systemm;
        return entity;
      });

      user.roles = rolesId.map((role: number) => {
        const entity = new RolesEntity();
        entity.id = role;
        return entity;
      });

      await user.save();

      return res.json(user);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user information' });
  }
});

export { router as updateUserRouter };