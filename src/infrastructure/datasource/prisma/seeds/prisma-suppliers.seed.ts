import { PrismaDatasource } from "../prisma-client";

const prismaClient = PrismaDatasource.getInstance();

const suppliers = [
  {
    supplier_name: "Carlos",
    supplier_lastname: "Ramírez",
    supplier_company: "Café Veracruzano",
    supplier_phone: "228-123-4567",
    supplier_email: "carlos.ramirez@cafev.com",
    supplier_address: "Av. Reforma 101, Veracruz",
  },
  {
    supplier_name: "María",
    supplier_lastname: "González",
    supplier_company: "Café Veracruzano",
    supplier_phone: "228-765-4321",
    supplier_email: "maria.gonzalez@cafev.com",
    supplier_address: "Calle Juárez 55, Veracruz",
  },
  {
    supplier_name: "José",
    supplier_lastname: "Martínez",
    supplier_company: "Distribuidora El Trigal",
    supplier_phone: "55-2345-6789",
    supplier_email: "jose.martinez@trigal.com",
    supplier_address: "Insurgentes Sur 800, CDMX",
  },
  {
    supplier_name: "Lucía",
    supplier_lastname: "Fernández",
    supplier_company: "Distribuidora El Trigal",
    supplier_phone: "55-8765-4321",
    supplier_email: "lucia.fernandez@trigal.com",
    supplier_address: "Av. Universidad 400, CDMX",
  },
  {
    supplier_name: "Andrés",
    supplier_lastname: "López",
    supplier_company: "Panadería San Juan",
    supplier_phone: "999-456-7890",
    supplier_email: "andres.lopez@pansj.com",
    supplier_address: "Calle 60 #245, Mérida",
  },
  {
    supplier_name: "Sofía",
    supplier_lastname: "Mendoza",
    supplier_company: "Panadería San Juan",
    supplier_phone: "999-123-4567",
    supplier_email: "sofia.mendoza@pansj.com",
    supplier_address: "Calle 62 #178, Mérida",
  },
  {
    supplier_name: "Pedro",
    supplier_lastname: "Castillo",
    supplier_company: "Lácteos del Valle",
    supplier_phone: "81-3456-7890",
    supplier_email: "pedro.castillo@lacteosvalle.com",
    supplier_address: "Av. Constitución 500, Monterrey",
  },
  {
    supplier_name: "Ana",
    supplier_lastname: "Hernández",
    supplier_company: "Lácteos del Valle",
    supplier_phone: "81-9876-5432",
    supplier_email: "ana.hernandez@lacteosvalle.com",
    supplier_address: "Av. Revolución 1200, Monterrey",
  },
  {
    supplier_name: "Miguel",
    supplier_lastname: "Torres",
    supplier_company: "Frutas Selectas",
    supplier_phone: "33-2233-4455",
    supplier_email: "miguel.torres@frutasselectas.com",
    supplier_address: "Mercado Abastos Local 45, Guadalajara",
  },
  {
    supplier_name: "Laura",
    supplier_lastname: "Vargas",
    supplier_company: "Frutas Selectas",
    supplier_phone: "33-9988-7766",
    supplier_email: "laura.vargas@frutasselectas.com",
    supplier_address: "Calle Independencia 300, Guadalajara",
  },
];

export const suppliersSeed = async () => {

  await prismaClient.supplier.createMany({
    data: suppliers
  })

  console.log('Suppliers seeded successfully.'); 
}

(async() => {
  await suppliersSeed()
})()