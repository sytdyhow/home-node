import express from "express";
import { SystemsEntity } from "../../entities/systems-entity";

const router = express.Router();

router.put("/systems/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const system = await SystemsEntity.findOneById(parseInt(id));

    // Check if the system exists
    if (!system) {
      return res.status(404).json({ error: "System not found" });
    }

    // Update the system properties
    if (!req.body.name) {
      return res.status(400).json({ error: "Name is required" });
    }
    system.name = req.body.name;

    if (!req.body.url) {
      return res.status(400).json({ error: "URL is required" });
    }
    system.url = req.body.url;

    if (!req.body.description) {
      return res.status(400).json({ error: "Description is required" });
    }
    system.description = req.body.description;

    if (!req.body.icon) {
      return res.status(400).json({ error: "Icon is required" });
    }
    system.icon = req.body.icon;
    system.is_active = req.body.is_active;
    system.permission_uri = req.body.permission_uri;

    // Save the updated system
    await system.save();

    return res.json({
      success: true,
      body: system
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router as updateSystemRouter };