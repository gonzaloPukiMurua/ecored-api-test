/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoryRepository{
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ){}

    create(data: Partial<Category>){
        return this.categoryRepository.create(data)
    }

    async save(category: Category): Promise<Category>{
        return await this.categoryRepository.save(category);
    }

    async findById(category_id: string): Promise<Category | null>{
        return await this.categoryRepository.findOne({
            where: { category_id },
            relations: ['parent', 'children'],
        });
    }

    async findAll(
        search: string,
        page = 1,
        limit = 10,
        order: 'ASC' | 'DESC' = 'ASC',
    ): Promise<{data: Category[], total: number, page: number, limit: number}>{
        const [data, total] = await this.categoryRepository.findAndCount({
            where: search ? { name: ILike(`%${search}%`)} : {},
            order: { created_at: order},
            skip: (page - 1) * limit,
            take: limit,
            relations: ['parent', 'children'],
        });

        return {
            data, 
            total,
            page,
            limit
        };
    }

    // ✅ Actualizar categoría
    async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
        await this.categoryRepository.update(id, data);
        const updated = await this.findById(id);
        if (!updated) throw new Error('No se encontró la categoría actualizada');
        return updated;
    }

    // 🚫 Desactivar (borrado lógico)
    async deactivateCategory(id: string): Promise<Category> {
        const category = await this.findById(id);
        if (!category) throw new Error('Categoría no encontrada');
        category.active = false;
        return await this.categoryRepository.save(category);
    }

}