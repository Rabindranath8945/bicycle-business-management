import Category from "../models/Category.js";

// @desc Get all categories
// @route GET /api/categories
// @access Public

// Create Categories
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // ❌ Already exists?
    const exists = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (exists)
      return res.status(409).json({ message: "Category already exists" });

    const category = await Category.create({ name, description });
    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get Categories

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// @desc Add a new category
// @route POST /api/categories
// @access Private (Admin)

// Add categories

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Error adding category" });
  }
};

// update Categories

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = req.params.id;

    const exists = await Category.findOne({
      _id: { $ne: id },
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (exists)
      return res
        .status(409)
        .json({ message: "Another category with this name already exists" });

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @desc Delete a category
// @route DELETE /api/categories/:id
// @access Private (Admin)

// Delete Categories
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
