import { ProductResponseIncludeDto } from "../../../application/dtos/product.dto";
import { DatesAdapter } from "../../plugins";

export function buildProductsHtml(products: ProductResponseIncludeDto[]) {
  
  const year = new Date().getFullYear();
  const dateReport = DatesAdapter.formatLocal(DatesAdapter.now());

  const totalProducts = products.length;
  const totalActive = products.filter(p => p.isActive).length;
  const totalInactive = totalProducts - totalActive;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Lista de Productos</title>
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
        max-width: 1100px;
        margin: 30px auto;
        background: #ffffff;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: linear-gradient(90deg, #047857, #10b981);
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
        color: #d1fae5;
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
        background-color: #10b981;
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
        background-color: #ecfdf5;
      }
      /* Imagen circular */
      .product-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #e5e7eb;
      }
      /* Estado */
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
          <h1>PuntoCom — Reporte de Productos</h1>
          <div class="date-report">Fecha de creación: ${dateReport}</div>
        </div>
        <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1755733945/puntocom/1_w2msdi.png" alt="Logo" />
      </div>

      <section class="stats">
        <ul class="stats__list">
          <li>Total de productos: <strong>${totalProducts}</strong></li>
          <li>Total activos: <strong>${totalActive}</strong></li>
          <li>Total inactivos: <strong>${totalInactive}</strong></li>
          <li>Stock total: <strong>${totalStock}</strong></li>
        </ul>
      </section>

      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Mínimo</th>
            <th>Categoría</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><img src="${p.name}" alt="Producto" class="product-img" /></td>
              <td>${p.name}</td>
              <td>${p.code}</td>
              <td>$${p.sellingPrice.toFixed(2)}</td>
              <td>${p.stock}</td>
              <td>${p.stockMin}</td>
              <td>${p.Category?.name || '—'}</td>
              <td><span class="status status--${p.isActive ? 'activo' : 'inactivo'}">${p.isActive ? 'Activo' : 'Inactivo'}</span></td>
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