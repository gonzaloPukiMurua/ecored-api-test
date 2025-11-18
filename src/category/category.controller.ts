/* eslint-disable prettier/prettier */
import { 
    Body, 
    Controller, 
    Post, 
    Get, 
    Param,
    Query,
    Put
} from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CreateCategoryDto } from './DTOs/create-category.dto';
import { UpdateCategoryDto } from './DTOs/update-category.dto';
import { 
    ApiOperation, 
    ApiResponse, 
    ApiTags,
    ApiQuery 
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { CategorySeedService } from './services/category-seed.service';
import { join } from 'path';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
    constructor(
      private readonly categoryService: CategoryService,
      private readonly categorySeedService: CategorySeedService
    ){}

    @Auth(AuthType.None)
    @Post()
    @ApiOperation({ summary: 'Crea una nueva categoría o subcategoría'})
    @ApiResponse({ status: 201, description: 'Categoría creada correctamente', type: Category})
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category>{
      console.log("Estoy en category POST despues del Guard")
        return await this.categoryService.createCategory(createCategoryDto);
    }

  // 🔵 Obtener una categoría por ID
  @Auth(AuthType.None)  
  @Get('detail/:id')
  @ApiOperation({ summary: 'Obtiene una categoría según su ID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Category })
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    const category =  await this.categoryService.getCategoryById(id);
    return category!;
  }

  // 🟣 Obtener todas las categorías (con filtros, búsqueda y paginación)
  @Auth(AuthType.None)
  @Get()
  @ApiOperation({ summary: 'Obtiene una lista de categorías con filtros, orden y paginación' })
  @ApiQuery({ name: 'search', required: false, description: 'Filtra por nombre de categoría' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página (por defecto 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de resultados por página (por defecto 10)' })
  @ApiQuery({ name: 'order', required: false, description: 'Orden ASC o DESC', enum: ['ASC', 'DESC'] })
  @ApiResponse({ 
    status: 200, 
    description: 'Listado de categorías', 
    type: [Category] 
})
  async getAllCategories(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    console.log("Estoy en api/categories GET.")
    return await this.categoryService.getAllCategories(search ?? '', Number(page), Number(limit), order);
  }

  @Auth(AuthType.None)
  @Get('parents')
  @ApiOperation({ summary: 'Obtiene categorías padre (sin parent_id)' })
  @ApiResponse({ status: 200, description: 'Listado de categorías padre', type: [Category] })
  async getParentCategories() {
    return await this.categoryService.getParentCategories();
  }

  @Auth(AuthType.None)
  @Get('subcategories')
  @ApiOperation({ summary: 'Obtiene todas las subcategorías (categorías con parent_id)' })
  @ApiResponse({ status: 200, description: 'Listado de subcategorías', type: [Category] })
  async getAllSubcategories() {
    return await this.categoryService.getAllSubcategories();
  }

  @Auth(AuthType.None)
  @Get('subcategories/:parentId')
  @ApiOperation({ summary: 'Obtiene subcategorías de una categoría padre específica' })
  @ApiResponse({ status: 200, description: 'Listado de subcategorías', type: [Category] })
  async getSubcategoriesOf(@Param('parentId') parentId: string) {
    return await this.categoryService.getSubcategoriesOf(parentId);
  }
  
  // ✅ PUT /api/category/:id/update
  @Put(':id/update')
  @ApiOperation({ summary: 'Actualiza una categoría existente' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada', type: Category })
  async updateCategory(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto): Promise<Category> {
      return await this.categoryService.updateCategory(id, updateDto);
  }

  // 🚫 PUT /api/category/:id/deactivate
  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Desactiva (borrado lógico) una categoría' })
  @ApiResponse({ status: 200, description: 'Categoría desactivada', type: Category })
  async deactivateCategory(@Param('id') id: string): Promise<Category> {
      return await this.categoryService.deactivateCategory(id);
  }

  @Post('categories')
  @Auth(AuthType.None)
  async runSeed() {
    const filePath = join(process.cwd(), 'src', 'data', 'categorias.xlsx');
    await this.categorySeedService.seedFromExcel(filePath);
    return { message: 'Categorías cargadas exitosamente' };
  }
}
