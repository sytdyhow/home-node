import express from "express";
import { SystemsEntity } from "../../entities/systems-entity"

const router = express.Router();

router.put("/system/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const system = await SystemsEntity.findOneById(parseInt(id));

    // Check if the rule exists
    if (!system) {
      return res.status(404).json({ error: "System not found" });
    }

    // Update the rule properties
    system.name = req.body.name;
    system.url =req.body.url;
    system.description=req.body.description;
    system.is_active=req.body.is_active

  
    // Save the updated rule
    await system.save();

    return res.json({ success: true }); // Add return statement here
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" }); // Add return statement here
  }
});

export { router as updateSystemRouter };