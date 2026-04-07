import { RoleEnum } from "../../../../generated/prisma";
import { UserResponseDtoI } from "../../../application/dtos/user.dto";
import { DatesAdapter } from "../../plugins";

export function buildUsersHtml(users: UserResponseDtoI[]) {

  const year = new Date().getFullYear();
  const dateReport = DatesAdapter.formatLocal(DatesAdapter.now());

  const totalUsers = users.length;
  const totalActiveUsers = users.filter(user => user.isActive).length;
  const totalInactiveUsers = totalUsers - totalActiveUsers;

  const totalAdminUsers = users.filter(user => user.role === RoleEnum.Administrador).length;
  const totalSupervisorUsers = users.filter(user => user.role === RoleEnum.Supervisor).length;
  const totalSellerUsers = users.filter(user => user.role === RoleEnum.Vendedor).length;

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Reporte de Usuarios — PuntoCom</title>

    <style>
      body {
        margin: 0;
        padding: 0;
        background: #fff;
        font-family: Arial, sans-serif;
        color: #222;
        font-size: 12px;
      }

      .container {
        max-width: 900px;
        margin: auto;
        padding: 25px;
        border: 1px solid #000;
        box-sizing: border-box;
      }

      @page {
        margin: 40px 25px;
      }

      .spacer-top {
        height: 18px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom: 2px solid #000;
      }

      .header-left h1 {
        margin: 0;
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 0.4px;
      }
      .header-left .biz {
        margin-top: 6px;
        font-size: 12px;
        line-height: 1.4;
      }
      .header img {
        width: 140px;
        height: 80px;
        object-fit: cover;
      }

      .sat-block {
        margin-top: 20px;
        border: 1px solid #000;
        border-collapse: collapse;
        width: 100%;
        font-size: 12px;
      }
      .sat-block th,
      .sat-block td {
        border: 1px solid #000;
        padding: 6px 8px;
        vertical-align: top;
      }
      .sat-block th {
        background: #f2f2f2;
        font-weight: bold;
        text-align: left;
        width: 160px;
      }

      table.report {
        width: 100%;
        margin-top: 24px; /* espacio adicional anti-pegar */
        border-collapse: collapse;
        font-size: 12px;
      }
      table.report th {
        background: #e6e6e6;
        border: 1px solid #000;
        padding: 8px;
        text-transform: uppercase;
        font-size: 11px;
      }
      table.report td {
        border: 1px solid #000;
        padding: 7px;
      }

      .status {
        font-weight: bold;
      }
      .status--activo {
        color: #0a5c2d;
      }
      .status--inactivo {
        color: #a60000;
      }

      .footer {
        border-top: 2px solid #000;
        text-align: center;
        margin-top: 26px;
        padding-top: 10px;
        font-size: 11px;
      }
    </style>
  </head>

  <body>
    <div class="container">

      <div class="header">
        <div class="header-left">
          <h1>PuntoCom — Reporte — Usuarios en sistema</h1>

          <div class="biz">
            Preparatoria “Jesús Reyes Heroles” <br>
            Av. Nazario Ortiz Garza, Lic. Benito Juárez, 20170 <br>
            Aguascalientes, Ags. México
          </div>
        </div>

        <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1775335887/puntocom/Blue_and_Black_Minimalist_Brand_Logo_3_xxeb1l.png" alt="Logo">
      </div>

      <table class="sat-block" style="margin-top: 18px;">
        <tr>
          <th>Fecha de emisión</th>
          <td>${dateReport}</td>
          <th>Entidad emisora</th>
          <td>PuntoCom</td>
        </tr>

        <tr>
          <th>Total de usuarios</th>
          <td>${totalUsers}</td>
          <th>Activos / Inactivos</th>
          <td>${totalActiveUsers} / ${totalInactiveUsers}</td>
        </tr>

        <tr>
          <th>Administradores</th>
          <td>${totalAdminUsers}</td>
          <th>Supervisores</th>
          <td>${totalSupervisorUsers}</td>
        </tr>

        <tr>
          <th>Vendedores</th>
          <td>${totalSellerUsers}</td>
          <th>Folio interno</th>
          <td>PC-${year}-${String(totalUsers).padStart(4, "0")}</td>
        </tr>
      </table>

      <table class="report">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Registro</th>
          </tr>
        </thead>

        <tbody>
          ${users
            .map(
              u => `
            <tr>
              <td>${u.name} ${u.lastname}</td>
              <td>${u.email}</td>
              <td>${u.role}</td>
              <td class="status status--${u.isActive ? "activo" : "inactivo"}">
                ${u.isActive ? "Activo" : "Inactivo"}
              </td>
              <td>${u.createdAt}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        Documento generado automáticamente — ${year} PuntoCom.<br>
        Reporte para fines administrativos y de control interno.
      </div>

    </div>

  </body>
  </html>
  `;
}
