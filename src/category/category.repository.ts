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
        console.log("Estoy en create category")
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
): Promise<{ data: (Category & { listingCount: number })[]; total: number; page: number; limit: number }> {
  const query = this.categoryRepository
    .createQueryBuilder('category')
    .leftJoin('category.parent', 'parent')
    .leftJoin('category.children', 'children')
    .leftJoin('category.listings', 'listing')
    .loadRelationCountAndMap('category.listingCount', 'category.listings')
    .orderBy('category.created_at', order)
    .skip((page - 1) * limit)
    .take(limit);

  if (search) {
    query.where('category.name ILIKE :search', { search: `%${search}%` });
  }

  const [data, total] = await query.getManyAndCount();

  // 👉 Convertimos el resultado para incluir listingCount en el tipo
  const mappedData = data.map((category) => ({
    ...category,
    listingCount: (category as any).listingCount ?? 0, // aseguramos el campo
  }));

  return {
    data: mappedData,
    total,
    page,
    limit,
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