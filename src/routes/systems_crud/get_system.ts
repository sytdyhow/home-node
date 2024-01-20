import express from "express";
import { SystemsEntity } from "../../entities/systems-entity";

const router = express.Router();

router.get('/systems', async (req, res) => {
  const systems = await SystemsEntity.find();
  // const activeSystems = systems.filter((system) => system.is_active === true);
  return res.send({results: systems});
});

export { router as getSystemrouter };