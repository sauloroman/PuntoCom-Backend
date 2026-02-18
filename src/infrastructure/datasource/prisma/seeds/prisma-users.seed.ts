import { RoleEnum } from "../../../../../generated/prisma";
import { HashAdapter } from "../../../../config/plugins";
import { PrismaDatasource } from "../prisma-client"

const prismaClient = PrismaDatasource.getInstance();

const users = [
  {
    user_name: "Saulo",
    user_lastname: "Nava",
    user_image: "https://randomuser.me/api/portraits/men/32.jpg",
    user_email: "saulo.nava@email.com",
    user_password: HashAdapter.hash("romanPass123.."),
    user_is_active: true,
    user_is_validated: true,
    user_phone: "4499198188",
    role: RoleEnum.Supervisor,
  },
  {
    user_name: "Test",
    user_lastname: "Test",
    user_image: "https://randomuser.me/api/portraits/women/44.jpg",
    user_email: "test@email.com",
    user_password: HashAdapter.hash("testPass123.."),
    user_is_active: true,
    user_phone: "4496548073",
    user_is_validated: false,
    role: RoleEnum.Administrador,
  },
  {
    user_name: "Carlos",
    user_lastname: "Hernández",
    user_image: "https://randomuser.me/api/portraits/men/12.jpg",
    user_email: "carlos.hernandez@email.com",
    user_password: HashAdapter.hash("carlosPass123.."),
    user_is_active: true,
    user_phone: "4495263633",
    user_is_validated: true,
    role: RoleEnum.Vendedor,
  },
  {
    user_name: "Ana",
    user_lastname: "Martínez",
    user_image: "https://randomuser.me/api/portraits/women/18.jpg",
    user_email: "ana.martinez@email.com",
    user_password: HashAdapter.hash("anaPass123.."),
    user_is_active: false,
    user_phone: "4497522113",
    user_is_validated: false,
    role: RoleEnum.Vendedor,
  },
  {
    user_name: "Luis",
    user_lastname: "Fernández",
    user_image: "https://randomuser.me/api/portraits/men/55.jpg",
    user_email: "luis.fernandez@email.com",
    user_password: HashAdapter.hash("luisPass123.."),
    user_is_active: true,
    user_phone: "4498526161",
    user_is_validated: true,
    role: RoleEnum.Vendedor,
  },
]

export const usersSeed = async () => {

  await prismaClient.user.createMany({
    data: users
  })

  console.log('Users seeded successfully.'); 
}

(async() => {
  await usersSeed()
})()