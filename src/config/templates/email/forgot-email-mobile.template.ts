export function mobileResetPasswordEmailTemplate(
  name: string,
  code: string
): string {

  const year = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablece tu contraseña - PuntoCom</title>
    </head>
    <body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f5f8fa; color:#333;">
      <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 3px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color:#1e3a8a; padding:25px 10px; text-align:center; color:white;">
          <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1755733945/puntocom/2_ioikmu.png" alt="Logo" style="max-width:120px; margin-bottom:10px;">
          <h2 style="margin:0; font-size:20px;">Restablece tu contraseña ☕</h2>
        </div>

        <!-- Content -->
        <div style="padding:25px 20px; text-align:center;">
          <h1 style="color:#1e3a8a; font-size:22px; margin-bottom:12px;">Hola, ${name}</h1>
          <p style="font-size:16px; color:#555; line-height:1.5; margin-bottom:20px;">
            Hemos recibido una solicitud para restablecer tu contraseña en la app móvil de <strong>PuntoCom</strong>.
            <br>Usa el siguiente código para continuar con el proceso:
          </p>

          <!-- Reset Code -->
          <div style="display:inline-block; background-color:#f1f5f9; border-radius:8px; padding:15px 30px; margin-bottom:25px;">
            <span style="font-size:28px; letter-spacing:6px; color:#1e3a8a; font-weight:bold;">${code}</span>
          </div>

          <p style="font-size:14px; color:#555; line-height:1.5;">
            Este código expirará en 15 minutos.<br>
            Si tú no solicitaste el cambio de contraseña, ignora este correo.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#777;">
          © ${year} PuntoCom. Todos los derechos reservados.
        </div>
      </div>
    </body>
    </html>
  `;
}
