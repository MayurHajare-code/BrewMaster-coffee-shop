import cloudinary from "../config/cloudinary.js";
import menuModel from "../models/menu.model.js";
import MenuModel from "../models/menu.model.js";

// get menu
export const getMenu = async (req, res, next) => {
    try {
        const menus = await MenuModel.find();
        res.status(200).json(menus);
    } catch (error) {
        next(error);
    }
};


// add menu
export const createMenu = async (req, res, next) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        const { name, price, quantity, description, category, available, feature, calories } = req.body;

        // const image = req.file ? `/public/${req.file.filename}` : null;

        const image = req.file
            ? {
                url: req.file.path,
                public_id: req.file.filename,
            }
            : null;

        const menu = await MenuModel.create({ name, price, quantity, description, category, available, feature, image, calories });

        res.status(201).json(menu);

    } catch (error) {
        next(error);
    }
};

// get menu by id
export const getMenuById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const menu = await MenuModel.findById(id);

        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }

        res.status(201).json(menu);
    } catch (error) {
        next(error);
    }
};

// update single category
export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, description, category, available, feature } = req.body;

        const updateData = {
            name, price, quantity, description, category, available, feature,
        };

        if (req.file) {
            // Delete old image from Cloudinary if exists
            const menu = await MenuModel.findById(id);
            if (menu?.image?.public_id) {
                await cloudinary.uploader.destroy(menu.image.public_id);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "menus",
            });

            updateData.image = {
                url: result.secure_url,
                public_id: result.public_id,
            };
        }

        const menu = await MenuModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }

        res.status(200).json(menu);
    } catch (error) {
        next(error);
    }
};

// delete single category
export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const menu = await menuModel.findByIdAndDelete(id);
        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }
        res.status(200).json({ message: "Menu deleted successfully" });
    } catch (error) {
        next(error);
    }
};


/*
// add menu
export const createMenu = async (req, res, next) => {
    try {
        const { name, price, quantity, description, category, available, feature } = req.body;
        // if (!name) {
        //     return res.status(400).json({ message: "Name is required" });
        // }
        const menu = await MenuModel.create({ name, price, quantity, description, category, available, feature });
        res.status(201).json(menu);
    } catch (error) {
        next(error);
    }
};

// update single category
export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, description, category, available, feature } = req.body;
        // if (!name) {
        //     return res.status(400).json({ message: "Name is required" });
        // }
        const menu = await MenuModel.findByIdAndUpdate(id, { name, price, quantity, description, category, available, feature }, { new: true, runValidators: true });

        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }

        res.status(200).json(menu);
    } catch (error) {
        next(error);
    }
};

*/