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
  <title>Reporte de Productos — PuntoCom</title>

  <style>

    @page {
      margin: 40px 25px;
    }

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

    /* Encabezado CFDI */
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

    /* Bloque SAT */
    .sat-block {
      margin-top: 15px;
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

    /* Tabla CFDI */
    table.report {
      width: 100%;
      margin-top: 22px;
      border-collapse: collapse;
      font-size: 12px;
      page-break-inside: auto;
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

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    /* Estado Activo/Inactivo */
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
      margin-top: 30px;
      padding-top: 10px;
      font-size: 11px;
    }

  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <div class="header-left">
        <h1>PuntoCom — Reporte — Productos en sistema</h1>

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
        <th>Total de productos</th>
        <td>${totalProducts}</td>
        <th>Activos / Inactivos</th>
        <td>${totalActive} / ${totalInactive}</td>
      </tr>

      <tr>
        <th>Stock total</th>
        <td>${totalStock}</td>
        <th>Folio interno</th>
        <td>PC-PROD-${year}-${String(totalProducts).padStart(4, "0")}</td>
      </tr>
    </table>

    <table class="report">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Código</th>
          <th>Categoría</th>
          <th>Stock</th>
          <th>Mínimo</th>
          <th>Precio</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        ${products
      .map(
        p => `
            <tr>
              <td>${p.name}</td>
              <td>${p.code}</td>
              <td>${p.Category?.name || "—"}</td>
              <td>${p.stock}</td>
              <td>${p.stockMin}</td>
              <td>$${p.sellingPrice.toFixed(2)}</td>
              <td class="status status--${p.isActive ? "activo" : "inactivo"}">
                ${p.isActive ? "Activo" : "Inactivo"}
              </td>
            </tr>
          `
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
