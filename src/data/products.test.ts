import {describe,it,expect} from 'vitest';
import {products,getProduct} from './products';
describe('商品演示数据',()=>{it('包含至少36个专业商品',()=>expect(products.length).toBeGreaterThanOrEqual(36));it('按ID获取商品',()=>expect(getProduct('p2').model).toBe('EM-4F-D10'));it('每个商品有MOQ和库存字段',()=>expect(products.every(p=>p.moq>0&&p.stock>=0)).toBe(true))});
