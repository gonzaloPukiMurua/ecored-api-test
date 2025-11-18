/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not, IsNull } from "typeorm";
import { Category } from "./entities/category.entity";
import { ListingStatus } from "src/listing/enums/listing-status.enum";

type CategoryWithCount = Category & { listingCount: number };

interface CategoryLoaded extends Category {
  listingCount: number;
}

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  create(data: Partial<Category>) {
    return this.categoryRepository.create(data);
  }

  async save(category: Category): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  async findById(category_id: string): Promise<Category | null> {
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
  ): Promise<{ data: CategoryWithCount[]; total: number; page: number; limit: number }> {

    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.parent', 'parent')
      .leftJoin('category.children', 'children')
      .leftJoin('category.listings', 'listing')
      .loadRelationCountAndMap('category.listingCount',
        'category.listings',
        'published_listings',
        (qb) =>
          qb.where('published_listings.status = :status', {
            status: ListingStatus.PUBLISHED,
      }),)
      .orderBy('category.created_at', order)
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      query.where('category.name ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query.getManyAndCount();

    const mappedData: CategoryWithCount[] = (data as CategoryLoaded[]).map((category) => ({
      ...category,
      listingCount: category.listingCount ?? 0,
    }));

    return { data: mappedData, total, page, limit };
  }

  async findByNameExact(name: string): Promise<Category | null> {
    const normalized = this.normalize(name);
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(TRIM(category.name)) = LOWER(TRIM(:name))', { name: normalized })
      .getOne();
  }

  // UPDATE
  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    await this.categoryRepository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('No se encontró la categoría actualizada');
    return updated;
  }

  // DEACTIVATE
  async deactivateCategory(id: string): Promise<Category> {
    const category = await this.findById(id);
    if (!category) throw new Error('Categoría no encontrada');
    category.active = false;
    return await this.categoryRepository.save(category);
  }

  // PARENTS
  async findParents(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parent: IsNull(), active: true },
      order: { name: 'ASC' },
    });
  }

  // SUBCATEGORIES
  async findSubcategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parent: Not(IsNull()), active: true },
      relations: ['parent'],
      order: { name: 'ASC' },
    });
  }

  async findSubcategoriesByParent(parentId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parent: { category_id: parentId }, active: true },
      relations: ['parent'],
      order: { name: 'ASC' },
    });
  }

  private normalize(str: string): string {
    return str
      ?.normalize('NFKD')              // separa tildes
      .replace(/[\u0300-\u036f]/g, '') // quita tildes
      .trim()
      .toLowerCase();
  }
}
