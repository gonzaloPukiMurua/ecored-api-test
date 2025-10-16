/* eslint-disable prettier/prettier */
import { 
    Body, 
    Controller, 
    Post, 
    Get, 
    Param,
    Query
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './DTOs/create-category.dto';
import { 
    ApiOperation, 
    ApiResponse, 
    ApiTags,
    ApiQuery 
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService){}

    @Post()
    @ApiOperation({ summary: 'Crea una nueva categoría o subcategoría'})
    @ApiResponse({ status: 201, description: 'Categoría creada correctamente', type: Category})
    async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category>{
        return await this.categoryService.createCategory(createCategoryDto);
    }

    // 🔵 Obtener una categoría por ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una categoría según su ID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Category })
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    const category =  await this.categoryService.getCategoryById(id);
    return category!;
  }

  // 🟣 Obtener todas las categorías (con filtros, búsqueda y paginación)
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
    return await this.categoryService.getAllCategories(search ?? '', Number(page), Number(limit), order);
  } 
}
