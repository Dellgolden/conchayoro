// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Pode passar o DTO direto com cast, já que os campos estão corretamente definidos
    return this.productModel.create(createProductDto as any);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findByPk(id);
    if (!product) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    await product.update(updateProductDto);
    return product;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }

  async findByCriteria(criteria: Partial<Product>): Promise<Product[]> {
    const whereClause: any = {};

    if (criteria.name) {
      whereClause.name = criteria.name;
    }
    if (criteria.category) {
      whereClause.category = criteria.category;
    }
    if (criteria.price) {
      whereClause.price = criteria.price;
    }
    if (criteria.rating) {
      whereClause.rating = criteria.rating;
    }

    return this.productModel.findAll({ where: whereClause });
  }
}
