import express from "express";
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();

router.post('/roles', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Role name is required' });
  }

  const roles = RolesEntity.create({
    name: name
  });

  try {
    await roles.save();
    return res.json({
      success: true,
      body: roles,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create role' });
  }
});

export {
  router as createRoleRouter
};