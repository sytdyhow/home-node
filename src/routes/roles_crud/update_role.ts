import express from "express";
import { RolesEntity } from "../../entities/roles-entity";

const router = express.Router();

router.put("/role/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const role = await RolesEntity.findOneById(parseInt(id));

    // Check if the rule exists
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Update the rule properties
    role.name = req.body.name;
   

    // Save the updated rule
    await role.save();

    return res.json({ success: true }); // Add return statement here
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" }); // Add return statement here
  }
});

export { router as updateRoleRouter };