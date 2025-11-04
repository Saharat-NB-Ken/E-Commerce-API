import * as categoryModel from "../models/category.model"
import { ApiError } from "../utils/apiError";

export const getAllCategoryService = async () => {
    const categoriesName = await categoryModel.getCategory();
    if (!categoriesName) throw ApiError.notFound("Categories not found");
    return categoriesName
}

export const getCategoryByIdService = async (id: number) => {
    const category = await categoryModel.getCategoryById(id);
    if (!category) throw ApiError.badRequest("Cannot create category");

    return category
}

export const createCategoryService = async (name: string) => {
    const category = await categoryModel.createCategory(name);
    if (!category) throw ApiError.badRequest("Cannot create category");
    return category
}

export const updateCategoryService = async (id: number, name: string) => {
    const categoryExists = await categoryModel.getCategoryById(id);
    if (!categoryExists) {
        throw ApiError.notFound("Category not found");
    }
    const category = await categoryModel.updateCategory(id, name);
    return category
}

export const deleteCategoryService = async (id: number) => {
    const categoryExists = await categoryModel.getCategoryById(id);
    if (!categoryExists) {
        throw ApiError.notFound("Category not found");
    }
    const category = await categoryModel.deleteCategory(id);
    return category
}