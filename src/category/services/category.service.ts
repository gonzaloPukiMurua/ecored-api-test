/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../category.repository';
import { CreateCategoryDto } from '../DTOs/create-category.dto';
import { UpdateCategoryDto } from '../DTOs/update-category.dto';
import { Category } from '../entities/category.entity';
@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository){}

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category>{
        const { name, parent_id} = createCategoryDto;
        let parent: Category | null = null;
        if(parent_id){
            parent = await this.categoryRepository.findById(parent_id);
            if(!parent){
                throw new NotFoundException(`No se encontró la categoría padre con ID ${parent_id}`);
            }
        }

        const category = this.categoryRepository.create({
            name, 
            parent,
        });

        return await this.categoryRepository.save(category);
    }

    async getCategoryById(id: string): Promise<Category | null | undefined>{
        const category = await this.categoryRepository.findById(id);
        if(!category){
            throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        return category;
    }

    async getAllCategories(
        search: string,
        page = 1,
        limit = 10,
        order: 'ASC' | 'DESC' = 'ASC',
    ): Promise<{data: Category[], total: number, page: number, limit: number}>{
        console.log("Estoy en category.service. data: ", search)
        return await this.categoryRepository.findAll(search, page, limit, order);
    }

    async findByNameExact(name: string) {
        return this.categoryRepository.findByNameExact(name);
    }

    // ✅ Actualizar categoría
    async updateCategory(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findById(id);
        if (!category) throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        return await this.categoryRepository.updateCategory(id, updateDto);
    }

    // 🚫 Desactivar categoría
    async deactivateCategory(id: string): Promise<Category> {
        const category = await this.categoryRepository.findById(id);
        if (!category) throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        return await this.categoryRepository.deactivateCategory(id);
    }

    async getParentCategories(): Promise<Category[]> {
        return await this.categoryRepository.findParents();
    }

    async getAllSubcategories(): Promise<Category[]> {
        return await this.categoryRepository.findSubcategories();
    }

    async getSubcategoriesOf(parentId: string): Promise<Category[]> {
        const parent = await this.categoryRepository.findById(parentId);

        if (!parent) {
            throw new NotFoundException(`Categoría padre con ID ${parentId} no encontrada`);
        }

        return await this.categoryRepository.findSubcategoriesByParent(parentId);
    }
}
