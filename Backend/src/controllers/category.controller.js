import CategoryModel from "../models/category.model.js";

// get categories
export const getCategory = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

// add category
export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const category = await CategoryModel.create({ name });
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

// update single category
export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const category = await CategoryModel.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

// delete single category
export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        next(error);
    }
};