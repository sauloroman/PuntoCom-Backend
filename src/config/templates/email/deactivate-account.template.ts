export function accountDeactivatedEmailTemplate(
  name: string
): string {

  const year = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Cuenta Desactivada - PuntoCom</title>
    </head>
    <body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f5f8fa; color:#333;">
      <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        
        <div style="background-color:#991b1b; padding:20px; text-align:center; color:white;">
          <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1755733945/puntocom/2_ioikmu.png" alt="Logo" style="max-width:120px; margin-bottom:10px;">
          <h2 style="margin:0; font-size:20px;">Cuenta Desactivada ☕</h2>
        </div>
        
        <div style="padding:30px; text-align:center;">
          <h1 style="color:#991b1b; font-size:24px; margin-bottom:15px;">Hola, ${name}</h1>
          <p style="font-size:16px; color:#555; line-height:1.5; margin:0 0 15px;">
            Queremos informarte que tu cuenta ha sido <strong>desactivada</strong> y actualmente no puedes acceder a nuestros servicios.
          </p>
          <p style="font-size:16px; color:#555; line-height:1.5; margin:0 0 25px;">
            Si crees que esto es un error o deseas reactivar tu cuenta, por favor ponte en contacto con el administrador.
          </p>
        </div>
        
        <div style="background-color:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#777;">
          © ${year} PuntoCom. Todos los derechos reservados.
        </div>
      </div>
    </body>
    </html>
  `;
}
