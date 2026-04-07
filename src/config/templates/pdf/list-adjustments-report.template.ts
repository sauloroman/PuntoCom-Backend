import { InventoryAdjustmentResponse } from "../../../application/dtos/inventory-adjustment.dto";
import { DatesAdapter } from "../../plugins";

export function buildInventoryAdjustmentsHtml(adjustments: InventoryAdjustmentResponse[]) {
  const year = new Date().getFullYear();
  const dateReport = DatesAdapter.formatLocal(DatesAdapter.now());

  const totalAdjustments = adjustments.length;
  const totalEntries = adjustments.filter(a => a.adjustmentType === "entrada").length;
  const totalExits = adjustments.filter(a => a.adjustmentType === "salida").length;
  const totalQuantityAdjusted = adjustments.reduce((sum, a) => sum + a.adjustmentQuantity, 0);

  const folio = Date.now().toString().slice(-6);

  const rows = adjustments
    .map(adj => {
      const productName = adj.Product?.name || "Producto sin nombre";
      const productCode = adj.Product?.code || "—";

      const typeLabel = adj.adjustmentType === "entrada" ? "Entrada" : "Salida";
      const typeClass = adj.adjustmentType === "entrada" ? "entry" : "exit";

      const prevQty = adj.adjustmentPrevQuantity;
      const newQty = adj.adjustmentQuantity;

      const userName = adj.User?.name || "Usuario desconocido";

      const dateFormatted = new Date(adj.adjustmentDate).toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return `
        <tr class="adjust-row">
          <td>${dateFormatted}</td>
          <td>${productName}</td>
          <td>${productCode}</td>
          <td class="${typeClass}">${typeLabel}</td>
          <td>${prevQty}</td>
          <td>${newQty}</td>
          <td>${userName}</td>
        </tr>

        <tr class="reason-row">
          <td colspan="8"><strong>Razón:</strong> ${adj.adjustmentReason}</td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte — Ajustes de Inventario</title>

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
      margin-top: 18px;
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
      text-align: left;
      font-weight: bold;
      width: 160px;
    }

    table.report {
      width: 100%;
      margin-top: 25px;
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
      vertical-align: top;
    }

    tr.adjust-row {
      page-break-inside: avoid;
    }
    tr.reason-row td {
      background: #fafafa;
      font-size: 11px;
      font-style: italic;
    }

    .entry {
      color: #0a5c2d;
      font-weight: bold;
    }
    .exit {
      color: #a60000;
      font-weight: bold;
    }

    .footer {
      border-top: 2px solid #000;
      text-align: center;
      margin-top: 25px;
      padding-top: 8px;
      font-size: 11px;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <div class="header-left">
        <h1>PuntoCom — Reporte — Ajustes de Inventario</h1>
        <div class="biz">
          Preparatoria “Jesús Reyes Heroles” <br>
          Av. Nazario Ortiz Garza, Lic. Benito Juárez, 20170 <br>
          Aguascalientes, Ags. México
        </div>
      </div>

      <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1775335887/puntocom/Blue_and_Black_Minimalist_Brand_Logo_3_xxeb1l.png">
    </div>

    <table class="sat-block">
      <tr>
        <th>Fecha de emisión</th>
        <td>${dateReport}</td>
        <th>Entidad emisora</th>
        <td>PuntoCom</td>
      </tr>

      <tr>
        <th>Total de ajustes</th>
        <td>${totalAdjustments}</td>
        <th>Total ajustado</th>
        <td>${totalQuantityAdjusted}</td>
      </tr>

      <tr>
        <th>Ajustes de entrada</th>
        <td>${totalEntries}</td>
        <th>Ajustes de salida</th>
        <td>${totalExits}</td>
      </tr>

      <tr>
        <th>Folio interno</th>
        <td colspan="3">PC-AJ-${year}-${folio}</td>
      </tr>
    </table>

    <table class="report">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Producto</th>
          <th>Código</th>
          <th>Tipo</th>
          <th>Cant. Prev.</th>
          <th>Cant. Nueva</th>
          <th>Usuario</th>
        </tr>
      </thead>

      <tbody>
        ${rows}
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
