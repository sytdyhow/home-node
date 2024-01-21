import express from "express";
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();

router.put("/roles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const role = await RolesEntity.findOneById(parseInt(id));

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    if (!req.body.name) {
      return res.status(400).json({ error: "Role name is required" });
    }

    role.name = req.body.name;
    await role.save();

    return res.json({
      success: true,
      body: role
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router as updateRoleRouter };