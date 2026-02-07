const productService = require('../../../src/services/product.service');
const Product = require('../../../src/models/Product');

jest.mock('../../../src/models/Product');

describe('Product Service - Core Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCategories', () => {
        it('should return all unique categories', async () => {
            const mockCategories = ['Electronics', 'Food', 'Clothing'];
            Product.distinct.mockResolvedValue(mockCategories);

            const result = await productService.getCategories();

            expect(result).toEqual(mockCategories);
            expect(Product.distinct).toHaveBeenCalledWith('category');
        });
    });

    describe('getCompanies', () => {
        it('should return all unique companies', async () => {
            const mockCompanies = ['Samsung', 'Apple', 'Sony'];
            Product.distinct.mockResolvedValue(mockCompanies);

            const result = await productService.getCompanies();

            expect(result).toEqual(mockCompanies);
            expect(Product.distinct).toHaveBeenCalledWith('company');
        });
    });

    describe('getById', () => {
        it('should get product by id', async () => {
            const mockProduct = { _id: '123', name: 'Test Product', category: 'Electronics' };
            Product.findById.mockResolvedValue(mockProduct);

            const result = await productService.getById('123');

            expect(result).toEqual(mockProduct);
            expect(Product.findById).toHaveBeenCalledWith('123');
        });

        it('should throw error if product not found', async () => {
            Product.findById.mockResolvedValue(null);

            await expect(productService.getById('nonexistent')).rejects.toThrow('Product not found');
        });
    });
});
