import * as userDashboardModel from "../../models/user/userDashboard.model";
import { ApiError } from "../../utils/apiError";

export const getProfile = async (userId: number) => {
    if (!userId) throw ApiError.notFound("User not found");
    return userDashboardModel.getProfile(userId);
};

export const getMoneySpent = async (userId: number) => {
    if (!userId) throw ApiError.notFound("User not found");
    return userDashboardModel.getMoneySpent(userId);
};

export const getOrdersCount = async (userId: number) => {
    if (!userId) throw ApiError.notFound("User not found");
    return userDashboardModel.getOrdersCount(userId);
};

export const getProductsByCategory = async (userId: number) => {
    if (!userId) throw ApiError.notFound("User not found");
    return userDashboardModel.getProductsByCategory(userId);
};

export const getCart = async (userId: number) => {
    if (!userId) throw ApiError.notFound("User not found");
    return userDashboardModel.getCart(userId);
};

export const getOrders = async (userId: number) => {
    if (!userId) throw ApiError.notFound("User not found");
    return userDashboardModel.getOrders(userId);
};

export const getNotifications = async (userId: number) => {
    if (!userId) throw ApiError.notFound("User not found");
    return userDashboardModel.getNotifications(userId);
}
