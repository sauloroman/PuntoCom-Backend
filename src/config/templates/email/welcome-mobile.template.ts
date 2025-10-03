import { EnvAdapter } from "../../plugins";

export function codeOnlyEmailTemplate(
  name: string,
  validationCode: string | number
): string {

  const year = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Código de Verificación</title>
    </head>
    <body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f5f8fa; color:#333;">
      <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        
        <div style="background-color:#1e3a8a; padding:20px; text-align:center; color:white;">
          <img src="https://res.cloudinary.com/dlamufioy/image/upload/v1755733945/puntocom/2_ioikmu.png" alt="Logo" style="width:50px; margin-bottom:10px;">
          <h2 style="margin:0; font-size:20px;">Verificación de Cuenta ☕</h2>
        </div>
        
        <div style="padding:30px; text-align:center;">
          <h1 style="color:#1e3a8a; font-size:24px; margin-bottom:15px;">¡Hola, ${name}!</h1>
          <p style="font-size:16px; color:#555; line-height:1.5; margin:0 0 15px;">
            Para continuar con tu registro en PuntoCom, ingresa el siguiente código de validación en la aplicación:
          </p>

          <div style="margin-top:25px;">
            <span style="display:inline-block; font-size:28px; font-weight:bold; letter-spacing:3px; color:#1e3a8a; background:#f1f5f9; padding:12px 20px; border-radius:8px;">
              ${validationCode}
            </span>
          </div>
        </div>
        
        <div style="background-color:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#777;">
          © ${year} PuntoCom. Todos los derechos reservados.
        </div>
      </div>
    </body>
    </html>
  `;
}
