import { ParsedQs } from "qs";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  search?: string;
}

export const getPaginationParams = (query: ParsedQs): PaginationParams => {
  const page = Math.max(1, query.page ? parseInt(query.page as string, 10) : 1);
  const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
  const skip = (page - 1) * limit;
  const take = limit;

  const orderBy = (query.orderBy as string) || "createdAt";
  const orderDirection =
    (query.orderDirection as string)?.toLowerCase() === "asc"
      ? "asc"
      : "desc";

  const search = query.search ? (query.search as string) : undefined;
  return { page, limit, skip, take, orderBy, orderDirection, search };
};
