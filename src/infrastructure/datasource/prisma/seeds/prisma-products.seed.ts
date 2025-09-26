import { PrismaDatasource } from "../prisma-client"

const prismaClient = PrismaDatasource.getInstance()

export const products = [
  {
    product_id: "1f5b3c41-0001-4f3a-8c77-a1c0c4f1a001",
    product_name: "Galletas de Avena",
    product_description: "Galletas artesanales de avena y miel.",
    product_image: "https://picsum.photos/200?1",
    product_code: "GAL-001",
    product_selling_price: 25.50,
    product_stock: 50,
    product_stock_min: 10,
    product_is_active: true,
    category_id: "27babb74-913e-42c9-92d0-cb5fd6ce245f", // Galletas
    supplier_id: "070a9b68-75e9-4a52-85fe-81902efa404d"  // Andrés López
  },
  {
    product_id: "1f5b3c41-0002-4f3a-8c77-a1c0c4f1a002",
    product_name: "Dona Glaseada",
    product_description: "Dona clásica cubierta de glaseado de azúcar.",
    product_image: "https://picsum.photos/200?2",
    product_code: "DON-001",
    product_selling_price: 18.00,
    product_stock: 60,
    product_stock_min: 12,
    product_is_active: true,
    category_id: "382e2562-c814-497f-9e1c-b85e2f7255c4", // Donas
    supplier_id: "5e68c26a-df7d-48e6-bf35-416cffa9e0b6"  // Sofía Mendoza
  },
  {
    product_id: "1f5b3c41-0003-4f3a-8c77-a1c0c4f1a003",
    product_name: "Bebida Energética RedMax",
    product_description: "Bebida energética con taurina y cafeína.",
    product_image: "https://picsum.photos/200?3",
    product_code: "ENE-001",
    product_selling_price: 32.00,
    product_stock: 40,
    product_stock_min: 8,
    product_is_active: true,
    category_id: "3a4a29f2-75b5-44e8-8af1-a99817922d55", // Energéticas
    supplier_id: "2de0bead-b382-4fc3-a566-69aeedbf6ffb"  // José Martínez
  },
  {
    product_id: "1f5b3c41-0004-4f3a-8c77-a1c0c4f1a004",
    product_name: "Cerveza Artesanal Rubia",
    product_description: "Cerveza artesanal de malta rubia, 5% alcohol.",
    product_image: "https://picsum.photos/200?4",
    product_code: "CER-001",
    product_selling_price: 55.00,
    product_stock: 25,
    product_stock_min: 6,
    product_is_active: true,
    category_id: "42b5e6ca-9d71-4f2e-8978-bc7e35f46c2c", // Cervezas
    supplier_id: "b48c2814-5450-4a37-af5c-fbe90096e2f2"  // Lucía Fernández
  },
  {
    product_id: "1f5b3c41-0005-4f3a-8c77-a1c0c4f1a005",
    product_name: "Vino Tinto Reserva",
    product_description: "Vino tinto de la casa, añejado 12 meses.",
    product_image: "https://picsum.photos/200?5",
    product_code: "VIN-001",
    product_selling_price: 150.00,
    product_stock: 15,
    product_stock_min: 4,
    product_is_active: true,
    category_id: "48af817f-0e2a-415d-8cd2-967ddf8d7c73", // Vinos
    supplier_id: "96b355ab-b018-4b0a-bc65-b8a1fe218768"  // Pedro Castillo
  },
  {
    product_id: "1f5b3c41-0006-4f3a-8c77-a1c0c4f1a006",
    product_name: "Pizza Margarita",
    product_description: "Mini pizza con queso mozzarella y albahaca.",
    product_image: "https://picsum.photos/200?6",
    product_code: "PIZ-001",
    product_selling_price: 65.00,
    product_stock: 30,
    product_stock_min: 6,
    product_is_active: true,
    category_id: "5be7f4ea-aa88-4fd4-bf1f-a46f4b2072d5", // Pizzas
    supplier_id: "2de0bead-b382-4fc3-a566-69aeedbf6ffb"  // José Martínez
  },
  {
    product_id: "1f5b3c41-0007-4f3a-8c77-a1c0c4f1a007",
    product_name: "Hamburguesa Clásica",
    product_description: "Hamburguesa de res con lechuga y jitomate.",
    product_image: "https://picsum.photos/200?7",
    product_code: "HAM-001",
    product_selling_price: 80.00,
    product_stock: 20,
    product_stock_min: 5,
    product_is_active: true,
    category_id: "60531de5-d362-43e6-879b-4551b9da9b65", // Hamburguesas
    supplier_id: "070a9b68-75e9-4a52-85fe-81902efa404d"  // Andrés López
  },
  {
    product_id: "1f5b3c41-0008-4f3a-8c77-a1c0c4f1a008",
    product_name: "Ensalada César",
    product_description: "Ensalada fresca con aderezo césar y crutones.",
    product_image: "https://picsum.photos/200?8",
    product_code: "ENS-001",
    product_selling_price: 45.00,
    product_stock: 35,
    product_stock_min: 7,
    product_is_active: true,
    category_id: "5f0cd70d-bf44-4dd0-9970-6f90e22d52b2", // Ensaladas
    supplier_id: "5f0aa198-25da-47ae-847d-8ae4646cbd5b"  // Miguel Torres
  },
  {
    product_id: "1f5b3c41-0009-4f3a-8c77-a1c0c4f1a009",
    product_name: "Sopa de Tomate",
    product_description: "Sopa casera de jitomate con especias.",
    product_image: "https://picsum.photos/200?9",
    product_code: "SOP-001",
    product_selling_price: 30.00,
    product_stock: 28,
    product_stock_min: 6,
    product_is_active: true,
    category_id: "6fae8d6f-fba8-4574-bc46-40d3182c4620", // Sopas
    supplier_id: "9934cf2c-19e1-4e76-a631-6fe1de8ad56d"  // Laura Vargas
  },
  {
    product_id: "1f5b3c41-0010-4f3a-8c77-a1c0c4f1a010",
    product_name: "Pasta Alfredo",
    product_description: "Pasta con salsa cremosa alfredo y parmesano.",
    product_image: "https://picsum.photos/200?10",
    product_code: "PAS-001",
    product_selling_price: 70.00,
    product_stock: 22,
    product_stock_min: 5,
    product_is_active: true,
    category_id: "86e990ad-0f7e-4dfd-b49b-3cce8df30eff", // Pastas
    supplier_id: "994519b1-c7bf-4025-baea-1d13bd162df0"  // Ana Hernández
  },
  {
    product_id: "1f5b3c41-0011-4f3a-8c77-a1c0c4f1a011",
    product_name: "Wrap de Pollo",
    product_description: "Wrap con pollo asado, verduras y aderezo.",
    product_image: "https://picsum.photos/200?11",
    product_code: "WRP-001",
    product_selling_price: 55.00,
    product_stock: 25,
    product_stock_min: 5,
    product_is_active: true,
    category_id: "bb15b7a7-3671-4774-b23e-f4c217e96f0b", // Wraps
    supplier_id: "bf3c36f1-32f5-4305-acc3-be25750a8258"  // María González
  },
  {
    product_id: "1f5b3c41-0012-4f3a-8c77-a1c0c4f1a012",
    product_name: "Croissant de Chocolate",
    product_description: "Croissant relleno de crema de chocolate.",
    product_image: "https://picsum.photos/200?12",
    product_code: "CRO-001",
    product_selling_price: 28.00,
    product_stock: 40,
    product_stock_min: 8,
    product_is_active: true,
    category_id: "d62269bf-67b8-44b7-94a7-f83f1b324760", // Croissants
    supplier_id: "070a9b68-75e9-4a52-85fe-81902efa404d"  // Andrés López
  },
  {
    product_id: "1f5b3c41-0013-4f3a-8c77-a1c0c4f1a013",
    product_name: "Helado de Vainilla",
    product_description: "Helado clásico de vainilla en vaso.",
    product_image: "https://picsum.photos/200?13",
    product_code: "HEL-001",
    product_selling_price: 35.00,
    product_stock: 45,
    product_stock_min: 9,
    product_is_active: true,
    category_id: "dfed472e-bf08-49f1-8707-0c6601a0d3b7", // Helados
    supplier_id: "5f0aa198-25da-47ae-847d-8ae4646cbd5b"  // Miguel Torres
  },
  {
    product_id: "1f5b3c41-0014-4f3a-8c77-a1c0c4f1a014",
    product_name: "Chocolate Caliente",
    product_description: "Bebida caliente a base de cacao mexicano.",
    product_image: "https://picsum.photos/200?14",
    product_code: "CHO-001",
    product_selling_price: 40.00,
    product_stock: 38,
    product_stock_min: 7,
    product_is_active: true,
    category_id: "e62f7422-85af-4ae8-862b-601d6a3c2666", // Chocolates
    supplier_id: "ab569c47-ab34-4f4e-ba13-eade29949f73"  // Carlos Ramírez
  },
  {
    product_id: "1f5b3c41-0015-4f3a-8c77-a1c0c4f1a015",
    product_name: "Agua Mineral",
    product_description: "Botella de agua mineral de 600ml.",
    product_image: "https://picsum.photos/200?15",
    product_code: "AGU-001",
    product_selling_price: 15.00,
    product_stock: 100,
    product_stock_min: 20,
    product_is_active: true,
    category_id: "b0dfca05-b792-4208-9414-c40bb9934897", // Agua y Refrescos
    supplier_id: "9934cf2c-19e1-4e76-a631-6fe1de8ad56d"  // Laura Vargas
  },
  {
    product_id: "1f5b3c41-0016-4f3a-8c77-a1c0c4f1a016",
    product_name: "Jugo Detox Verde",
    product_description: "Mezcla de pepino, apio, piña y jengibre.",
    product_image: "https://picsum.photos/200?16",
    product_code: "DET-001",
    product_selling_price: 45.00,
    product_stock: 30,
    product_stock_min: 6,
    product_is_active: true,
    category_id: "f494ed56-5cba-4436-a12e-567421def897", // Detox
    supplier_id: "5f0aa198-25da-47ae-847d-8ae4646cbd5b"  // Miguel Torres
  },
  {
    product_id: "1f5b3c41-0017-4f3a-8c77-a1c0c4f1a017",
    product_name: "Especialidad Internacional Ramen",
    product_description: "Ramen japonés con caldo de miso y verduras.",
    product_image: "https://picsum.photos/200?17",
    product_code: "INT-001",
    product_selling_price: 95.00,
    product_stock: 18,
    product_stock_min: 4,
    product_is_active: true,
    category_id: "d00e38ad-76f1-44fa-87c0-b35a3cb55a22", // Internacionales
    supplier_id: "2de0bead-b382-4fc3-a566-69aeedbf6ffb"  // José Martínez
  },
  {
    product_id: "1f5b3c41-0018-4f3a-8c77-a1c0c4f1a018",
    product_name: "Platillo Vegano Bowl",
    product_description: "Bowl con quinoa, garbanzos y aguacate.",
    product_image: "https://picsum.photos/200?18",
    product_code: "VEG-001",
    product_selling_price: 78.00,
    product_stock: 20,
    product_stock_min: 5,
    product_is_active: true,
    category_id: "4c4507c2-b38d-4e58-9bef-0fa78d658c4c", // Veganos
    supplier_id: "bf3c36f1-32f5-4305-acc3-be25750a8258"  // María González
  },
  {
    product_id: "1f5b3c41-0019-4f3a-8c77-a1c0c4f1a019",
    product_name: "Platillo Sin Gluten Pasta",
    product_description: "Pasta libre de gluten con salsa de tomate.",
    product_image: "https://picsum.photos/200?19",
    product_code: "GLU-001",
    product_selling_price: 85.00,
    product_stock: 16,
    product_stock_min: 4,
    product_is_active: true,
    category_id: "a3dc8a0f-92ac-43dc-92ae-8f9d15d06147", // Sin Gluten
    supplier_id: "96b355ab-b018-4b0a-bc65-b8a1fe218768"  // Pedro Castillo
  },
  {
    product_id: "1f5b3c41-0020-4f3a-8c77-a1c0c4f1a020",
    product_name: "Coctel Piña Colada",
    product_description: "Coctel tropical con piña y coco.",
    product_image: "https://picsum.photos/200?20",
    product_code: "COC-001",
    product_selling_price: 90.00,
    product_stock: 12,
    product_stock_min: 3,
    product_is_active: true,
    category_id: "50be147b-a665-433f-87b5-c068325246c9", // Cocteles
    supplier_id: "ab569c47-ab34-4f4e-ba13-eade29949f73"  // Carlos Ramírez
  }
]

export const productSeed = async () => {
    await prismaClient.product.createMany({
        data: products
    })

    console.log('Products seeded successfully')
}

(async () => {
    await productSeed()
})()