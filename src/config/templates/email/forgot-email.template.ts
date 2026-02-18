import { EnvAdapter } from "../../plugins";

export function resetPasswordEmailTemplate(
  name: string,
  token: string,
  code: string | number
): string {

  const url = `${EnvAdapter.FRONTEND_URL}/auth/change-password/${token}`;
  const year = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Restablece tu contraseña - PuntoCom</title>
    </head>
    <body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f5f8fa; color:#333;">
      <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        
        <div style="background-color:#1e3a8a; padding:20px; text-align:center; color:white;">
          <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1755733945/puntocom/2_ioikmu.png" alt="Logo" style="max-width:120px; margin-bottom:10px;">
          <h2 style="margin:0; font-size:20px;">Restablece tu contraseña ☕</h2>
        </div>
        
        <div style="padding:30px; text-align:center;">
          <h1 style="color:#1e3a8a; font-size:24px; margin-bottom:15px;">Hola, ${name}</h1>
          
          <p style="font-size:16px; color:#555; line-height:1.5; margin:0 0 15px;">
            Hemos recibido una solicitud para restablecer tu contraseña.<br>
            Puedes usar el siguiente código de verificación. Presiona en el botón para ingresarlo:
          </p>

          <!-- Código destacado -->
          <div style="
            margin:20px auto;
            padding:15px;
            background:#f1f5ff;
            border:2px dashed #2563eb;
            border-radius:8px;
            font-size:22px;
            font-weight:bold;
            color:#1e3a8a;
            letter-spacing:3px;
            width:fit-content;">
            ${code}
          </div>
          
          <a href="${url}" 
            style="display:inline-block; margin-top:20px; padding:12px 25px; background-color:#2563eb; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
            Crear nueva contraseña
          </a>
          
          <p style="margin-top:20px; font-size:14px; color:#555;">
            Si tú no solicitaste este cambio, puedes ignorar este correo.
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
