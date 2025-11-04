import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/category.service"

export const getAllNameCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryName = await categoryService.getAllCategoryService();
        res.json(categoryName);
    } catch (error) {
        next(error)
    }
}

export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const category = await categoryService.getCategoryByIdService(id);
        res.json(category);
    }
    catch (error) {
        next(error)
    }
}

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const category = await categoryService.createCategoryService(name);
        res.status(201).json(category);
    } catch (error) {
        next(error)
    }
}

export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name } = req.body;
        const category = await categoryService.updateCategoryService(id, name);
        res.json(category);
    } catch (error) {
        next(error)
    }
}

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        await categoryService.deleteCategoryService(id);
        res.status(204).send();
    } catch (error) {
        next(error)
    }
}