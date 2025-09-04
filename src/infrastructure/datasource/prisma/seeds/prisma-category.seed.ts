import { PrismaDatasource } from "../prisma-client"

const prismaClient = PrismaDatasource.getInstance();

const categories = [
  {
    category_name: "Wraps",
    category_description: "Wraps de pollo, vegetales y opciones vegetarianas."
  },
  {
    category_name: "Ensaladas",
    category_description: "Ensaladas frescas y nutritivas con diferentes aderezos."
  },
  {
    category_name: "Pastas",
    category_description: "Platillos de pasta con salsas variadas."
  },
  {
    category_name: "Hamburguesas",
    category_description: "Hamburguesas clásicas y gourmet con diferentes carnes y vegetales."
  },
  {
    category_name: "Pizzas",
    category_description: "Mini pizzas y opciones personalizadas."
  },
  {
    category_name: "Sopas",
    category_description: "Sopas y cremas caseras para acompañar."
  },
  {
    category_name: "Bebidas Energéticas",
    category_description: "Bebidas con cafeína y taurina para dar energía."
  },
  {
    category_name: "Agua y Refrescos",
    category_description: "Agua natural, mineral y refrescos comerciales."
  },
  {
    category_name: "Cervezas Artesanales",
    category_description: "Selección de cervezas artesanales locales e importadas."
  },
  {
    category_name: "Vinos",
    category_description: "Vinos tintos, blancos y rosados."
  },
  {
    category_name: "Cocteles",
    category_description: "Mezclas con y sin alcohol para ocasiones especiales."
  },
  {
    category_name: "Bebidas Detox",
    category_description: "Jugos y mezclas naturales para desintoxicar el cuerpo."
  },
  {
    category_name: "Helados",
    category_description: "Variedades de helado en vaso, cono y malteadas."
  },
  {
    category_name: "Chocolates",
    category_description: "Bebidas y postres a base de cacao."
  },
  {
    category_name: "Donas",
    category_description: "Donas glaseadas y rellenas de diferentes sabores."
  },
  {
    category_name: "Croissants",
    category_description: "Croissants rellenos de chocolate, jamón o queso."
  },
  {
    category_name: "Galletas",
    category_description: "Galletas artesanales y empaquetadas."
  },
  {
    category_name: "Platillos Veganos",
    category_description: "Opciones 100% veganas para todos los gustos."
  },
  {
    category_name: "Platillos Sin Gluten",
    category_description: "Comida libre de gluten para dietas especiales."
  },
  {
    category_name: "Especialidades Internacionales",
    category_description: "Platillos y bebidas inspiradas en cocinas del mundo."
  },
];

export const categorySeed = async () => {

  await prismaClient.category.createMany({
    data: categories
  })

  console.log('Categories seeded successfully.'); 
}

(async() => {
  await categorySeed()
})()