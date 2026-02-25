import { HashAdapter } from '../../../../config/plugins';
import { MssqlClient } from '../mssql-client';

// const users = [
//   {
//     user_name: 'Saulo',
//     user_lastname: 'Nava',
//     user_image: 'https://randomuser.me/api/portraits/men/32.jpg',
//     user_email: 'saulo.nava@email.com',
//     user_password: HashAdapter.hash('romanPass123..'),
//     user_is_active: true,
//     user_is_validated: true,
//     user_phone: '4499198188',
//     role: 'Supervisor',
//   },
//   {
//     user_name: 'Test',
//     user_lastname: 'Test',
//     user_image: 'https://randomuser.me/api/portraits/women/44.jpg',
//     user_email: 'test@correo.com',
//     user_password: HashAdapter.hash('testPass123..'),
//     user_is_active: true,
//     user_phone: '4496548073',
//     user_is_validated: false,
//     role: 'Administrador',
//   },
//   {
//     user_name: 'Carlos',
//     user_lastname: 'Hernández',
//     user_image: 'https://randomuser.me/api/portraits/men/12.jpg',
//     user_email: 'carlos.hernandez@email.com',
//     user_password: HashAdapter.hash('carlosPass123..'),
//     user_is_active: true,
//     user_phone: '4495263633',
//     user_is_validated: true,
//     role: 'Vendedor',
//   },
//   {
//     user_name: 'Ana',
//     user_lastname: 'Martínez',
//     user_image: 'https://randomuser.me/api/portraits/women/18.jpg',
//     user_email: 'ana.martinez@email.com',
//     user_password: HashAdapter.hash('anaPass123..'),
//     user_is_active: false,
//     user_phone: '4497522113',
//     user_is_validated: false,
//     role: 'Vendedor',
//   },
//   {
//     user_name: 'Luis',
//     user_lastname: 'Fernández',
//     user_image: 'https://randomuser.me/api/portraits/men/55.jpg',
//     user_email: 'luis.fernandez@email.com',
//     user_password: HashAdapter.hash('luisPass123..'),
//     user_is_active: true,
//     user_phone: '4498526161',
//     user_is_validated: true,
//     role: 'Vendedor',
//   },
// ];

const users = [
  {
    user_name: 'Test',
    user_lastname: 'Test',
    user_image: '',
    user_email: 'test@correo.com',
    user_password: HashAdapter.hash('testPass123..'),
    user_is_active: true,
    user_phone: '4496548073',
    user_is_validated: false,
    role: 'Administrador',
  },
]

export const usersSeed = async () => {
  const pool = await MssqlClient.getConnection();

  for (const user of users) {
    await pool.request()
      .input('user_name',       user.user_name)
      .input('user_lastname',   user.user_lastname)
      .input('user_image',      user.user_image)
      .input('user_email',      user.user_email)
      .input('user_password',   user.user_password)
      .input('user_is_active',  user.user_is_active)
      .input('user_is_validated', user.user_is_validated)
      .input('user_phone',      user.user_phone)
      .input('role',            user.role)
      .query(`
        INSERT INTO [User] (
          user_name,
          user_lastname,
          user_image,
          user_email,
          user_password,
          user_is_active,
          user_is_validated,
          user_phone,
          role
        ) VALUES (
          @user_name,
          @user_lastname,
          @user_image,
          @user_email,
          @user_password,
          @user_is_active,
          @user_is_validated,
          @user_phone,
          @role
        )
      `);
  }

  console.log('Users seeded successfully.');
  await MssqlClient.disconnect();
};

(async () => {
  await usersSeed();
})();