// lib/renderHtml.ts

export function renderHtml(link: string, type: string, password: string | null): string {

    const registerMessage = `
        <p>Para completar el proceso de registro, presione el botón de verificación. ¡Gracias por confiar en nosotros!</p>
    `
    const recoverMessage = `
        <p>Para restablecer su contraseña, presione el botón de verificación. Si usted no solicitó este cambio, puede ignorar este mensaje.</p>
        <p>Si fuiste tú, al acceder al botón tu contraseña se actualizará automaticamente a la siguiente:</p>
        <div style="margin-bottom: 8px; margin-top: 8px; background-color: #1a1a1a; color: white; padding: 8px; border-radius: 8px;">
            ${password}
        </div>
        <strong>¡Hazlo con precaución!</strong>
    `

    const message =
        type === 'register'
            ? registerMessage
            : recoverMessage

    return `
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml" lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="format-detection" content="telephone=no,email=no,address=no" />

            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Albert+Sans:wght@400&display=swap" rel="stylesheet" />

            <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                font-family: 'Inter', 'Segoe UI', sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            img {
                border: 0;
                display: block;
                max-width: 100%;
                height: auto;
            }
            a {
                text-decoration: none;
                color: inherit;
            }
            p {
                margin: 0;
                padding: 0;
                line-height: 1.5;
            }
            .container {
                max-width: 400px;
                margin: 40px auto;
                background: #fff;
                border: 1px solid #cecece;
                border-radius: 20px;
                overflow: hidden;
                background-image: url(https://5b26b6ba-fa0a-4c35-a601-3b1bfebe94f7.b-cdn.net/e/a7f96963-f40a-4bd5-b033-f1f7b177a9c6/39b6fe59-c578-4628-bad0-8679dd42de62.jpeg);
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center bottom;
                padding: 50px 40px;
                text-align: center;
            }
            .logo {
                width: 84px;
                margin: 0 auto 30px;
            }
            h1 {
                font-size: 20px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: -1.2px;
                color: #111;
                margin-bottom: 20px;
            }
            .message {
                font-size: 15px;
                color: #424040;
                padding: 10px;
                border: 1px solid #cacaca;
                border-radius: 16px;
                margin-bottom: 24px;
            }
            .button {
                display: inline-block;
                background: #f09596;
                color: #000;
                font-weight: 700;
                font-size: 15px;
                padding: 12px 24px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            .note {
                font-style: italic;
                font-size: 14px;
                color: #424040;
                margin-bottom: 40px;
            }
            .footer {
                background: #000;
                color: #fdfcff;
                font-size: 12px;
                padding: 20px 30px;
                border-radius: 8px;
                text-align: center;
            }
            </style>
        </head>

        <body>
            <div class="container">
            <img class="logo" src="https://5b26b6ba-fa0a-4c35-a601-3b1bfebe94f7.b-cdn.net/e/a7f96963-f40a-4bd5-b033-f1f7b177a9c6/82739f0a-80e9-413c-bd55-e9a723953b3b.png" alt="Logo" />

            <h1>Por favor, verifique su correo</h1>

            <div class="message">
                ${message}
            </div>

            <a class="button" href="${link}" target="_blank">Verificar mi cuenta</a>

            <p class="note">* Este enlace expirará en 24 horas. Si no realizaste esta solicitud, puedes ignorar este mensaje.</p>
            </div>

            <div class="footer">
            Este es un mensaje automático. Por favor, no responda a este correo.
            </div>
        </body>
        </html>
    `;
}