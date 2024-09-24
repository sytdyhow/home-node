import express from "express";
import { RulesEntity } from "../../entities/rules-entity";

const router = express.Router();

router.put("/rule/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const rule = await RulesEntity.findOneById(parseInt(id));

    // Check if the rule exists
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    // Update the rule properties
    rule.rule_name = req.body.ruleName;
    rule.severity_in = req.body.severity_in;
    rule.severity_out = req.body.severity_out;
    rule.application = req.body.application;
    rule.keywords = req.body.keywords;
    rule.description = req.body.description;
    rule.deny_duplicate = req.body.deny_duplicate;
    rule.interval = req.body.interval;

    // Save the updated rule
    await rule.save();

    return res.json({ success: true }); // Add return statement here
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" }); // Add return statement here
  }
});

export { router as updateRuleRouter };