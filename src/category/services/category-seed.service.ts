/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, Logger } from '@nestjs/common';
import * as XLSXraw from 'xlsx';
import type { WorkBook, WorkSheet } from 'xlsx';
import { CategoryService } from './category.service';
import { CategoryBlock } from '../enums/category-block.enum';

const XLSX = XLSXraw as unknown as {
  readFile(path: string): WorkBook;
  utils: {
    sheet_to_json<T>(ws: WorkSheet): T[];
  };
};

@Injectable()
export class CategorySeedService {
  private readonly logger = new Logger(CategorySeedService.name);

  constructor(private readonly categoryService: CategoryService) {}

  async seedFromExcel(filePath: string): Promise<void> {
    
    this.logger.log(`📥 Leyendo Excel: ${filePath}`);

    const BLOCK_MAP: Record<string, CategoryBlock> = {
        A: CategoryBlock.MATERIALES_Y_GRANEL,
        B: CategoryBlock.PRODUCTOS_FUNCIONALES,
        C: CategoryBlock.SECTORES_ESPECIFICOS,
        D: CategoryBlock.ESPECIAL_Y_VARIOS,
        E: CategoryBlock.NUEVAS_SUGERIDAS,
    };

    const workbook: WorkBook = XLSX.readFile(filePath);
    const sheetName: string = workbook.SheetNames[0];
    const sheet: WorkSheet = workbook.Sheets[sheetName];

    interface ExcelRow {
      Bloque?: string;
      Categoria?: string;
      Subcategoria?: string;
    }

    const rows: ExcelRow[] = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

    const categoryCache = new Map<string, string>();
    const subcategoryCache = new Map<string, string>();

    for (const row of rows) {
      const rawBlock = row.Bloque?.trim();
      const blockLetter = rawBlock?.charAt(0) ?? null;
      const block: CategoryBlock | null = blockLetter && BLOCK_MAP[blockLetter] ? BLOCK_MAP[blockLetter] : null;
      const categoryName = row.Categoria?.trim();
      const subcategoryName = row.Subcategoria?.trim();

      if (!categoryName) {
        this.logger.warn(
          `Fila sin categoría detectada, ignorando: ${JSON.stringify(row)}`
        );
        continue;
      }

      let categoryId: string;

      if (categoryCache.has(categoryName)) {
        categoryId = categoryCache.get(categoryName)!;
      } else {
        try {
          const cat = await this.categoryService.createCategory({
            name: categoryName,
            block,
          });

          categoryId = cat.category_id;
          this.logger.log(`✔️ Categoría creada: ${categoryName}`);
        } catch {
          const existing = await this.categoryService.getAllCategories(
            categoryName,
            1,
            1
          );

          if (existing.data.length > 0) {
            categoryId = existing.data[0].category_id;
            this.logger.log(
              `↪️ Categoría existente encontrada: ${categoryName}`
            );
          } else {
            this.logger.error(
              `❌ No se pudo crear ni encontrar categoría: ${categoryName}`
            );
            continue;
          }
        }

        categoryCache.set(categoryName, categoryId);
      }

      if (!subcategoryName) continue;

      if (!subcategoryCache.has(subcategoryName)) {
        try {
          const subcat = await this.categoryService.createCategory({
            name: subcategoryName,
            parent_id: categoryId,
            block,
          });

          subcategoryCache.set(subcategoryName, subcat.category_id);
          this.logger.log(`   └─ ✔️ Subcategoría creada: ${subcategoryName}`);
        } catch {
          this.logger.warn(
            `   └─ ↪️ Subcategoría ya existente: ${subcategoryName}`
          );
        }
      }
    }

    this.logger.log('🎉 Seed de categorías completado');
  }
}
