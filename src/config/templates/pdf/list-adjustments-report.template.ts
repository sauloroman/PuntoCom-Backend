import { InventoryAdjustmentResponse } from "../../../application/dtos/inventory-adjustment.dto";
import { DatesAdapter } from "../../plugins";

export function buildInventoryAdjustmentsHtml(adjustments: InventoryAdjustmentResponse[]) {
   const year = new Date().getFullYear();
  const dateReport = DatesAdapter.formatLocal(DatesAdapter.now());

  const totalAdjustments = adjustments.length;
  const totalEntries = adjustments.filter(a => a.adjustmentType === 'entrada').length;
  const totalExits = adjustments.filter(a => a.adjustmentType === 'salida').length;
  const totalQuantityAdjusted = adjustments.reduce((sum, a) => sum + a.adjustmentQuantity, 0);

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Ajustes de Inventario</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        color: #1f2937;
        padding: 20px;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .header {
        background: linear-gradient(135deg, #047857 0%, #10b981 100%);
        padding: 32px;
        border-radius: 16px 16px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
        box-shadow: 0 4px 20px rgba(4, 120, 87, 0.3);
      }
      .header img {
        max-width: 140px;
        filter: brightness(0) invert(1);
      }
      .header h1 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .date-report {
        font-size: 14px;
        opacity: 0.9;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        padding: 24px;
        background: white;
      }
      .stat-card {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        padding: 20px;
        border-radius: 12px;
        border: 2px solid #bbf7d0;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .stat-card__label {
        font-size: 11px;
        color: #065f46;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
      }
      .stat-card__value {
        font-size: 32px;
        font-weight: 800;
        color: #047857;
      }
      .stat-card--entries {
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        border-color: #86efac;
      }
      .stat-card--exits {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        border-color: #fca5a5;
      }
      .stat-card--exits .stat-card__label {
        color: #991b1b;
      }
      .stat-card--exits .stat-card__value {
        color: #dc2626;
      }
      .adjustments-timeline {
        background: white;
        padding: 24px;
        border-radius: 0 0 16px 16px;
      }
      .timeline-item {
        display: flex;
        gap: 20px;
        margin-bottom: 24px;
        position: relative;
        padding-left: 40px;
      }
      .timeline-item::before {
        content: '';
        position: absolute;
        left: 15px;
        top: 40px;
        bottom: -24px;
        width: 2px;
        background: linear-gradient(180deg, #d1fae5 0%, #e5e7eb 100%);
      }
      .timeline-item:last-child::before {
        display: none;
      }
      .timeline-dot {
        position: absolute;
        left: 8px;
        top: 20px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 2px #10b981;
      }
      .timeline-dot--entrada {
        background: #10b981;
      }
      .timeline-dot--salida {
        background: #ef4444;
        box-shadow: 0 0 0 2px #ef4444;
      }
      .adjustment-card {
        flex: 1;
        background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
      }
      .adjustment-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 2px solid #f3f4f6;
      }
      .product-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }
      .product-img {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        object-fit: cover;
        border: 2px solid #e5e7eb;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .product-details h3 {
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 4px;
      }
      .product-code {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
      }
      .adjustment-type {
        padding: 6px 14px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .adjustment-type--entrada {
        background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%);
        color: #065f46;
        box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
      }
      .adjustment-type--salida {
        background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
        color: #991b1b;
        box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
      }
      .card-body {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr;
        gap: 16px;
        margin-bottom: 16px;
      }
      .info-box {
        background: #f9fafb;
        padding: 12px;
        border-radius: 8px;
        text-align: center;
      }
      .info-box__label {
        font-size: 10px;
        color: #6b7280;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
      }
      .info-box__value {
        font-size: 20px;
        font-weight: 800;
        color: #1f2937;
      }
      .info-box__value--entrada {
        color: #059669;
      }
      .info-box__value--salida {
        color: #dc2626;
      }
      .reason-box {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #fbbf24;
      }
      .reason-box__label {
        font-size: 10px;
        color: #78350f;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
      }
      .reason-box__text {
        font-size: 13px;
        color: #92400e;
        line-height: 1.4;
        font-weight: 500;
      }
      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid #e5e7eb;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 12px;
        box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
      }
      .user-details {
        display: flex;
        flex-direction: column;
      }
      .user-name {
        font-size: 13px;
        font-weight: 600;
        color: #1f2937;
      }
      .user-role {
        font-size: 11px;
        color: #6b7280;
        text-transform: capitalize;
      }
      .date-badge {
        background: #f3f4f6;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 11px;
        color: #4b5563;
        font-weight: 600;
      }
      .footer {
        background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        border-radius: 0 0 16px 16px;
        margin-top: -8px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div>
          <h1>Ajustes de Inventario</h1>
          <div class="date-report">📅 Reporte generado: ${dateReport}</div>
        </div>
        <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1755733945/puntocom/1_w2msdi.png" alt="Logo" />
      </div>

      <section class="stats">
        <div class="stat-card">
          <div class="stat-card__label">Total Ajustes</div>
          <div class="stat-card__value">${totalAdjustments}</div>
        </div>
        <div class="stat-card stat-card--entries">
          <div class="stat-card__label">✅ Entradas</div>
          <div class="stat-card__value">${totalEntries}</div>
        </div>
        <div class="stat-card stat-card--exits">
          <div class="stat-card__label">⚠️ Salidas</div>
          <div class="stat-card__value">${totalExits}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__label">Cantidad Total</div>
          <div class="stat-card__value">${totalQuantityAdjusted}</div>
        </div>
      </section>

      <section class="adjustments-timeline">
        ${adjustments.map(adj => {
          const isEntry = adj.adjustmentType === 'entrada';
          const formattedDate = new Date(adj.adjustmentDate).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          const userInitial = adj.User?.name ? adj.User.name.charAt(0).toUpperCase() : '?';
          
          return `
          <div class="timeline-item">
            <div class="timeline-dot timeline-dot--${adj.adjustmentType}"></div>
            <div class="adjustment-card">
              <div class="card-header">
                <div class="product-info">
                  <img 
                    src="${adj.Product?.image || 'https://res.cloudinary.com/dlamufioy/image/upload/v1760635222/puntocom/box_g67qzb.png'}" 
                    alt="Producto" 
                    class="product-img" 
                  />
                  <div class="product-details">
                    <h3>${adj.Product?.name || 'Producto sin nombre'}</h3>
                    <div class="product-code">Código: ${adj.Product?.code || '—'}</div>
                  </div>
                </div>
                <span class="adjustment-type adjustment-type--${adj.adjustmentType}">
                  ${isEntry ? '📈 Entrada' : '📉 Salida'}
                </span>
              </div>

              <div class="card-body">
                <div class="info-box">
                  <div class="info-box__label">Anterior</div>
                  <div class="info-box__value">${adj.adjustmentPrevQuantity}</div>
                </div>
                <div class="info-box">
                  <div class="info-box__label">Ajuste</div>
                  <div class="info-box__value info-box__value--${adj.adjustmentType}">
                    ${isEntry ? '+' : ''}${adj.adjustmentQuantity}
                  </div>
                </div>
                <div class="reason-box">
                  <div class="reason-box__label">💬 Razón</div>
                  <div class="reason-box__text">${adj.adjustmentReason}</div>
                </div>
              </div>

              <div class="card-footer">
                <div class="user-info">
                  <div class="user-avatar">${userInitial}</div>
                  <div class="user-details">
                    <span class="user-name">${adj.User?.name || 'Usuario desconocido'}</span>
                    <span class="user-role">${adj.User?.role || '—'}</span>
                  </div>
                </div>
                <div class="date-badge">🕐 ${formattedDate}</div>
              </div>
            </div>
          </div>
        `}).join('')}
      </section>

      <div class="footer">
        © ${year} PuntoCom. Todos los derechos reservados.
      </div>
    </div>
  </body>
  </html>
  `;
}