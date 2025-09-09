import { RoleEnum } from "../../../../../generated/prisma";
import { PrismaDatasource } from "../prisma-client"

const prismaClient = PrismaDatasource.getInstance();

const users = [
  {
    user_name: "Saulo",
    user_lastname: "Nava",
    user_image: "https://randomuser.me/api/portraits/men/32.jpg",
    user_email: "saulo.nava@example.com",
    user_password: "123456", // ⚠️ en prod: usar bcrypt
    user_is_active: true,
    user_is_validated: true,
    role: RoleEnum.Supervisor,
  },
  {
    user_name: "María",
    user_lastname: "Gómez",
    user_image: "https://randomuser.me/api/portraits/women/44.jpg",
    user_email: "maria.gomez@example.com",
    user_password: "123456",
    user_is_active: true,
    user_is_validated: false,
    role: RoleEnum.Vendedor,
  },
  {
    user_name: "Carlos",
    user_lastname: "Hernández",
    user_image: "https://randomuser.me/api/portraits/men/12.jpg",
    user_email: "carlos.hernandez@example.com",
    user_password: "123456",
    user_is_active: true,
    user_is_validated: true,
    role: RoleEnum.Vendedor,
  },
  {
    user_name: "Ana",
    user_lastname: "Martínez",
    user_image: "https://randomuser.me/api/portraits/women/18.jpg",
    user_email: "ana.martinez@example.com",
    user_password: "123456",
    user_is_active: false,
    user_is_validated: false,
    role: RoleEnum.Vendedor,
  },
  {
    user_name: "Luis",
    user_lastname: "Fernández",
    user_image: "https://randomuser.me/api/portraits/men/55.jpg",
    user_email: "luis.fernandez@example.com",
    user_password: "123456",
    user_is_active: true,
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