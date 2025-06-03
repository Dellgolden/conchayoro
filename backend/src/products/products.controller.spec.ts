import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const product = {
  id: '1',
  name: 'Product1',
  price: 10,
  category: 'C1',
  rating: 1,
};

const createProductDto: CreateProductDto = {
  name: 'Product1',
  price: 10,
  category: 'C1',
  rating: 1,
};

const updateProductDto: UpdateProductDto = {
  name: 'UpdatedProduct',
  price: 10,
  category: 'C1',
  rating: 1,
};

describe('ProductsController', () => {
  let productsController: ProductsController;

  const mockProductsService = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCriteria: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: getModelToken(Product),
          useValue: {},
        },
      ],
    }).compile();

    productsController = moduleRef.get<ProductsController>(ProductsController);
  });

  it('should create a product', async () => {
    mockProductsService.create.mockResolvedValue(product);

    expect(await productsController.create(createProductDto)).toEqual(product);
  });

  it('should update a product', async () => {
    const id = '1';
    mockProductsService.update.mockResolvedValue(product);

    expect(await productsController.update(id, updateProductDto)).toBe(product);
  });

  it('should delete a product', async () => {
    const id = '1';
    mockProductsService.remove.mockResolvedValue(undefined);

    expect(await productsController.remove(id)).toBeUndefined();
  });

  it('should return an array of products', async () => {
    const mockedResponseData = [product];
    mockProductsService.findAll.mockResolvedValue(mockedResponseData);

    expect(await productsController.findAll()).toBe(mockedResponseData);
  });

  it('should return a specific product', async () => {
    const id = '1';
    mockProductsService.findOne.mockResolvedValue(product);

    expect(await productsController.findOne(id)).toBe(product);
  });

  it('should return an array of products by criteria', async () => {
    const criteria = { category: 'C1' };
    const mockedResponseData = [product];
    mockProductsService.findByCriteria.mockResolvedValue(mockedResponseData);

    expect(await productsController.findByCriteria(criteria)).toBe(mockedResponseData);
  });
});
