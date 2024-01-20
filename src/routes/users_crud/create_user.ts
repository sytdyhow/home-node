import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import * as bcrypt from 'bcrypt'
import { SystemsEntity } from "../../entities/systems-entity";
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();

router.post('/users', async (req, res) => {
  const {
    username,
    password,
    is_active,
    systemId,
    rolesId,
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is missing. Please provide a username." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is missing. Please provide a password." });
  }

  if (!systemId || systemId.length === 0) {
    return res.status(400).json({ error: "Systems are missing. Please provide system IDs." });
  }

  if (!rolesId) {
    return res.status(400).json({ error: "Roles are missing. Please provide role IDs." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = UsersEntity.create({
    username: username,
    password: hashedPassword, 
    is_active: is_active,
    data_joined: new Date(),

    systems: systemId.map((systemm: number) => {
      const entity = new SystemsEntity();
      entity.id = systemm;
      return entity;
    }),

    roles: Array.isArray(rolesId) ? rolesId.map((roleId: number) => {
      const entity = new RolesEntity();
      entity.id = roleId;
      return entity;
    }) : [],
  });

  await user.save();
  return res.json(user);
});

export {
  router as createUserRouter 
};