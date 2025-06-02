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
  let productsService: ProductsService;
  let productsController: ProductsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(Product),
          useValue: {},
        },
      ],
    }).compile();

    productsService = moduleRef.get<ProductsService>(ProductsService);
    productsController = moduleRef.get<ProductsController>(ProductsController);
  });

  it('should create a product', async () => {
    jest
      .spyOn(productsService, 'create')
      .mockImplementation(() => Promise.resolve(product as unknown as Product));

    expect(await productsController.create(createProductDto)).toEqual(product);
  });

  it('should update a product', async () => {
    const mockedResponseData = product as unknown as Product;
    const id = '1';

    jest
      .spyOn(productsService, 'update')
      .mockImplementation(() => Promise.resolve(mockedResponseData));

    expect(await productsController.update(id, updateProductDto)).toBe(
      mockedResponseData,
    );
  });

  it('should delete a product', async () => {
    const id = '1';

    jest
      .spyOn(productsService, 'remove')
      .mockImplementation(() => Promise.resolve());

    expect(await productsController.remove(id)).toBeUndefined();
  });

  it('should return an array of products', async () => {
    const mockedResponseData = [];

    jest
      .spyOn(productsService, 'findAll')
      .mockImplementation(() => Promise.resolve(mockedResponseData));

    expect(await productsController.findAll()).toBe(mockedResponseData);
  });

  it('should return a specific product', async () => {
    const mockedResponseData = product as unknown as Product;
    const id = '1';

    jest
      .spyOn(productsService, 'findOne')
      .mockImplementation(() => Promise.resolve(mockedResponseData));

    expect(await productsController.findOne(id)).toBe(mockedResponseData);
  });
});
