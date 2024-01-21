import express from "express";
import { UsersEntity } from "../../entities/users-entity";
import * as bcrypt from 'bcrypt'
import { SystemsEntity } from "../../entities/systems-entity";

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

  if (!rolesId || rolesId.length ===0) {
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

    roles_id: rolesId
  });

  try {
    await user.save();
    return res.json({
      success: true,
      body: user,
    });
  } catch (error) {
    // Check if the error is a duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Username is already taken. Please choose a different username." });
    }

    // Return a generic error message for other types of errors
    return res.status(500).json({ error: "An error occurred while creating the user." });
  }
});

export {
  router as createUserRouter 
};