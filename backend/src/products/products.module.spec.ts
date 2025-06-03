import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ProductsModule } from './products.module';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const databaseConnection: SequelizeModuleOptions = {
  dialect: 'sqlite',
  omitNull: true,
  autoLoadModels: true,
  synchronize: true,
};

const createProductDto: CreateProductDto = {
  name: 'Product1',
  price: 10,
  category: 'C1',
  rating: 1,
};

const updateProductDto: UpdateProductDto = {
  name: 'Product1-updated',
  price: 11,
  category: 'C2',
  rating: 2,
};

describe('ProductsModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SequelizeModule.forRoot(databaseConnection), ProductsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /products deve retornar array vazio inicialmente', async () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect([]);
  });

  it('POST /products deve criar um novo produto', async () => {
    return request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(createProductDto.name);
        expect(res.body.price).toBe(createProductDto.price);
        expect(res.body.category).toBe(createProductDto.category);
        expect(res.body.rating).toBe(createProductDto.rating);
      });
  });

  it('PUT /products deve atualizar um produto existente', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201);

    const id = response.body.id;

    return request(app.getHttpServer())
      .put(`/products/${id}`)
      .send(updateProductDto)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.name).toBe(updateProductDto.name);
        expect(res.body.price).toBe(updateProductDto.price);
        expect(res.body.category).toBe(updateProductDto.category);
        expect(res.body.rating).toBe(updateProductDto.rating);
      });
  });

  it('DELETE /products deve remover um produto existente', async () => {
  const response = await request(app.getHttpServer())
    .post('/products')
    .set('Content-Type', 'application/json')
    .send(createProductDto)
    .expect(201);

  const id = response.body.id;

  return request(app.getHttpServer())
    .delete(`/products/${id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual({});
      });
  });
});
