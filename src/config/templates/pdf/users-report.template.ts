import { UserResponseDtoI } from "../../../application/dtos/user.dto";
import { DatesAdapter } from "../../plugins";


export function buildUsersHtml(users: UserResponseDtoI[]) {
  
  const year = new Date().getFullYear();
  
  const dateReport = DatesAdapter.formatLocal( DatesAdapter.now() )

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Reporte de Usuarios</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f5f8fa;
        color: #333;
      }
      .container {
        max-width: 900px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .header {
        background-color: #1e3a8a;
        padding: 20px;
        text-align: center;
        color: white;
      }
      .header img {
        max-width: 120px;
        margin-bottom: 10px;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .date-report {
        margin-top: 8px;
        font-size: 14px;
        color: #e0e7ff;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 10px 8px;
        font-size: 14px;
        text-align: left;
      }
      th {
        background-color: #2563eb;
        color: white;
        font-weight: bold;
      }
      tr:nth-child(even) {
        background-color: #f9fafb;
      }
      tr:hover {
        background-color: #eef3fd;
      }
      .footer {
        background-color: #f1f5f9;
        padding: 12px;
        text-align: center;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://via.placeholder.com/120x40?text=LOGO" alt="Logo" />
        <h1>Reporte de Usuarios</h1>
        <div class="date-report">Fecha: ${dateReport}</div>
      </div>

      <table>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Fecha de creación</th>
        </tr>
        ${users.map(u => `
          <tr>
            <td>${u.name}</td>
            <td>${u.role}</td>
            <td>${u.email}</td>
            <td>${u.isActive ? 'Activo' : 'Inactivo'}</td>
            <td>${u.updatedAt}</td>
          </tr>
        `).join('')}
      </table>

      <div class="footer">
        © ${year} PuntoCom. Todos los derechos reservados.
      </div>
    </div>
  </body>
  </html>
  `;
}
