export interface CategoryResponseDto {
    id: number,
    name: string,
    createAt: Date,
    updateAt: Date
}

export interface CreateCategoryDto {
    name: string
}

export interface UpdateCategoryDto {
    name?: string
}