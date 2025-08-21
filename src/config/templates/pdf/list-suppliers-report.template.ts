import { SupplierResponseDto } from "../../../application/dtos/supplier.dto";
import { DatesAdapter } from "../../plugins";

export function buildSuppliersHtml(suppliers: SupplierResponseDto[]) {
  
  const year = new Date().getFullYear();
  const dateReport = DatesAdapter.formatLocal( DatesAdapter.now() )

  const totalSuppliers = suppliers.length
  const totalActiveSuppliers = suppliers.filter( supplier => supplier.isActive ).length
  const totalInactiveSuppliers = totalSuppliers - totalActiveSuppliers

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Lista de Proveedores</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-size: 14px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f5f7fa;
        color: #333;
      }
      .container {
        max-width: 1000px;
        margin: 30px auto;
        background: #ffffff;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: linear-gradient(90deg, #1e3a8a, #2563eb);
        padding: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
      }
      .header img {
        max-width: 140px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .date-report {
        margin-top: 6px;
        font-size: 13px;
        color: #c7d2fe;
      }
      .stats {
        width: 95%;
        margin: 1rem auto;
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e5e7eb;
      }
      .stats__list {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .stats__list li {
        margin: 6px 0;
      }
      .stats__list--right {
        text-align: right;
      }
      table {
        width: 95%;
        margin: 1.5rem auto;
        border-collapse: separate;
        border-spacing: 0;
        border: 1px solid #e5e7eb;
        overflow: hidden;
      }
      th, td {
        padding: 12px 10px;
        font-size: 12px;
        text-align: left;
      }
      th {
        background-color: #2563eb;
        color: white;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.5px;
      }
      tr:nth-child(even) {
        background-color: #f9fafb;
      }
      tr:hover {
        background-color: #eef2ff;
      }

      /* Badges para roles */
      .tag {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
      }
      .tag--admin {
        background-color: #fef3c7;
        color: #b45309;
      }
      .tag--supervisor {
        background-color: #e0f2fe;
        color: #0369a1;
      }
      .tag--vendedor {
        background-color: #dcfce7;
        color: #166534;
      }

      /* Badges para estado */
      .status {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
      }
      .status--activo {
        background-color: #bbf7d0;
        color: #065f46;
      }
      .status--inactivo {
        background-color: #fecaca;
        color: #991b1b;
      }

      .footer {
        background-color: #f1f5f9;
        padding: 14px;
        text-align: center;
        font-size: 12px;
        color: #555;
        border-top: 1px solid #e5e7eb;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div>
          <h1>PuntoCom — Reporte de Proveedores</h1>
          <div class="date-report">Fecha de creación: ${dateReport}</div>
        </div>
        <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1755733945/puntocom/1_w2msdi.png" alt="Logo" />
      </div>

      <section class="stats">
        <ul class="stats__list">
          <li>Total de proveedores: <strong>${totalSuppliers}</strong></li>
          <li>Total de proveedores activos: <strong>${totalActiveSuppliers}</strong></li>
          <li>Total de proveedores inactivos: <strong>${totalInactiveSuppliers}</strong></li>
        </ul>
      </section>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Empresa</th>
            <th>Teléfono</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${suppliers.map(s => `
              <tr>
                <td>${s.name} ${s.lastname}</td>
                <td>${s.email}</td>
                <td>${s.company}</td>
                <td>${s.phone}</td>
                <td><span class="status status--${s.isActive ? 'activo' : 'inactivo'}">${s.isActive ? 'Activo' : 'Inactivo'}</span></td>
              </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        © ${year} PuntoCom. Todos los derechos reservados.
      </div>
    </div>
  </body>
  </html>
  `;
}