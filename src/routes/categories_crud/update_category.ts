import express from "express";
import { CategoriesEntity } from "../../entities/categories";

const router = express.Router();

router.put("/categories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await CategoriesEntity.findOneBy({id: parseInt(id)});

    // Check if the category exists
    if (category == null) return res.status(404).json({ error: "category not found" });

    category.category_name = req.body.category_name;
    // Save the updated category
    await category.save();

    return res.json({
      success: true,
      body: category
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router as updateCategoryRouter };