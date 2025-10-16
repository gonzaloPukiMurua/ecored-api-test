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
}