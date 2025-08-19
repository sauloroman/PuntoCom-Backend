import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const users = [
    { name: 'Roman 1', email: 'roman1@correo.com', role: 'administrador', isActive: true },
    { name: 'Roman 2', email: 'roman2@correo.com', role: 'administrador', isActive: false },
    { name: 'Roman 3', email: 'roman3@correo.com', role: 'supervisor', isActive: true },
    { name: 'Roman 4', email: 'roman4@correo.com', role: 'supervisor', isActive: true },
    { name: 'Roman 5', email: 'roman5@correo.com', role: 'vendedor', isActive: true },
    { name: 'Roman 6', email: 'roman6@correo.com', role: 'vendedor', isActive: true },
    { name: 'Roman 7', email: 'roman7@correo.com', role: 'vendedor', isActive: false }
];

async function generateUsersPdfReport(users: any[]) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const html = buildHtml(users);
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
}

function buildHtml(users: { name: string, email: string, role: string, isActive: boolean }[]) {
  const year = new Date().getFullYear();
  const dateReport = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Reporte de Usuarios</title>
    <style>
      body { margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f5f8fa; color:#333; }
      .container { max-width:900px; margin:30px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08); }
      .header { background-color:#1e3a8a; padding:20px; text-align:center; color:white; }
      .header img { max-width:120px; margin-bottom:10px; }
      .header h1 { margin:0; font-size:22px; }
      .date-report { margin-top:8px; font-size:14px; color:#e0e7ff; }
      table { width:100%; border-collapse:collapse; margin-top:20px; }
      th, td { border:1px solid #ddd; padding:10px 8px; font-size:14px; text-align:left; }
      th { background-color:#2563eb; color:white; font-weight:bold; }
      tr:nth-child(even) { background-color:#f9fafb; }
      tr:hover { background-color:#eef3fd; }
      .footer { background-color:#f1f5f9; padding:12px; text-align:center; font-size:12px; color:#777; margin-top:20px; }
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
        </tr>
        ${users.map(u => `
          <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>${u.isActive ? 'Activo' : 'Inactivo'}</td>
          </tr>
        `).join('')}
      </table>

      <div class="footer">© ${year} PuntoCom. Todos los derechos reservados.</div>
    </div>
  </body>
  </html>
  `;
}

// Función principal que genera y guarda el PDF
(async () => {
  try {
    const pdfBuffer = await generateUsersPdfReport(users);
    const outputPath = path.join(process.cwd(), 'reporte-usuarios.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`✅ PDF generado correctamente en: ${outputPath}`);
  } catch (err) {
    console.error('❌ Error generando PDF:', err);
  }
})();
