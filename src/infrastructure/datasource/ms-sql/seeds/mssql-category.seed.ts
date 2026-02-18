import { DatesAdapter, IDAdapter } from '../../../../config/plugins';
import { MssqlClient } from '../mssql-client';

const categories = [
  {
    category_name: 'Cereales y Desayuno',
    category_description: 'Cereales, avena, granola y productos para el desayuno',
    category_icon: '',
    category_is_active: true
  },
  {
    category_name: 'Dulces y Chocolates',
    category_description: 'Chocolates, caramelos, gomitas y dulces variados',
    category_icon: '',
    category_is_active: true
  },
  {
    category_name: 'Refrescos',
    category_description: 'Bebidas carbonatadas, sodas y refrescos de diferentes sabores',
    category_icon: '',
    category_is_active: true
  },
  {
    category_name: 'Jugos y Bebidas',
    category_description: 'Jugos naturales, néctares, bebidas energéticas y deportivas',
    category_icon: '',
    category_is_active: true
  },
  {
    category_name: 'Snacks y Botanas',
    category_description: 'Papas fritas, frituras, palomitas y botanas saladas',
    category_icon: '',
    category_is_active: true
  },
  {
    category_name: 'Lácteos',
    category_description: 'Leche, yogurt, queso, mantequilla y productos lácteos',
    category_icon: '',
    category_is_active: true
  },
  {
    category_name: 'Panadería',
    category_description: 'Pan, pasteles, galletas y productos de panadería',
    category_icon: '',
    category_is_active: true
  },
  {
    category_name: 'Carnes y Embutidos',
    category_description: 'Carnes frescas, jamones, salchichas y embutidos',
    category_icon: '',
    category_is_active: true
  },
  {
    category_name: 'Frutas y Verduras',
    category_description: 'Frutas y verduras frescas de temporada',
    category_icon: '',
    category_is_active: true
  },
  {
    category_name: 'Limpieza',
    category_description: 'Productos de limpieza para el hogar',
    category_icon: '',
    category_is_active: false 
  }
];

export const categoriesSeed = async () => {
  const pool = await MssqlClient.getConnection();

  for (const category of categories) {
    await pool.request()
      .input('category_id',          IDAdapter.generate())
      .input('category_name',        category.category_name)
      .input('category_description', category.category_description)
      .input('category_icon',        category.category_icon)
      .input('category_is_active',   category.category_is_active)
      .input('category_createdAt',   DatesAdapter.now())
      .input('category_updatedAt',   DatesAdapter.now())
      .query(`
        INSERT INTO Category (
          category_id,
          category_name,
          category_description,
          category_icon,
          category_is_active,
          category_createdAt,
          category_updatedAt
        ) VALUES (
          @category_id,
          @category_name,
          @category_description,
          @category_icon,
          @category_is_active,
          @category_createdAt,
          @category_updatedAt
        )
      `);
  }

  console.log('Categories seeded successfully.');
  await MssqlClient.disconnect();
};

(async () => {
  await categoriesSeed();
})();