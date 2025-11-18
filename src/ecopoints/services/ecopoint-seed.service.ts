/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { EcopointActionService } from './action.service';
import { CategoryFactorService } from './category-factor.service';
import { CategoryService } from 'src/category/services/category.service';
import { Category } from 'src/category/entities/category.entity';

interface ActionRow {
  Accion: string;
  'Puntaje base': number;
}

interface FactorRow {
  Categoria: string;
  'Factor Circular': number;
}

@Injectable()
export class EcopointSeedService {
  constructor(
    private readonly actionService: EcopointActionService,
    private readonly factorService: CategoryFactorService,
    private readonly categoryService: CategoryService,
  ) {}

  /** Normaliza cadenas del Excel para compararlas */
  private normalize(str: string): string {
    return str
      ?.normalize('NFKD')               // separa tildes
      .replace(/[\u0300-\u036f]/g, '')  // quita tildes
      .trim()
      .toLowerCase();
  }

  /** Carga un archivo Excel */
  private loadExcel<T>(path: string): T[] {
    const workbook = XLSX.readFile(path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json<T>(sheet);
  }

  /** ---------------- SEED DE ACCIONES ---------------- */
  async seedActions(path: string) {
    const rows = this.loadExcel<ActionRow>(path);

    for (const row of rows) {
      const actionName = row.Accion;
      const pointsBase = row['Puntaje base'];

      if (!actionName || typeof pointsBase !== 'number') {
        console.warn('Fila inválida en Excel de acciones:', row);
        continue;
      }

      await this.actionService.create({
        name: actionName,
        points_base: pointsBase,
      });
    }

    return { message: 'Seed de acciones completado' };
  }

  /** ---------------- SEED DE FACTORES ---------------- */
  async seedFactors(path: string) {
    const rows = this.loadExcel<FactorRow>(path);

    // Obtener todas las categorías para búsqueda en memoria
    const allCategories = await this.categoryService.getParentCategories();

    // Normalizar nombres para hacer diccionario rápido
    const normalizedMap = new Map<string, Category>();

    for (const cat of allCategories) {
      normalizedMap.set(this.normalize(cat.name), cat);
    }

    for (const row of rows) {
      const categoryName = row.Categoria;
      const factor = row['Factor Circular'];

      if (!categoryName || typeof factor !== 'number') {
        console.warn('Fila inválida en Excel de factores:', row);
        continue;
      }

      // Normalizar nombre del Excel
      const normalizedExcelName = this.normalize(categoryName);

      // Buscar categoría padre
      const parentCategory = normalizedMap.get(normalizedExcelName);

      if (!parentCategory) {
        console.warn(`❌ Categoría padre NO encontrada: "${categoryName}" (normalizada: "${normalizedExcelName}")`);
        continue;
      }

      console.log(`✔ Categoría encontrada: DB="${parentCategory.name}" ← Excel="${categoryName}"`);

      await this.factorService.create({
        category_id: parentCategory.category_id,
        factor_circular: factor,
      });
    }

    return { message: 'Seed de factores completado' };
  }

  /** Ejecuta ambos seeds */
  async runAll() {
    await this.seedActions('src/data/puntajes.xlsx');
    await this.seedFactors('src/data/factores.xlsx');

    return { message: 'Seeds de EcoPoints completados' };
  }
}
