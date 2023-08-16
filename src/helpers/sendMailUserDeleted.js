import { transporter } from "../config/gmail.js";

const emailTemplate = `<div>
<h1>CUENTA ELIMINADA</h1>
<img src="https://paissano.com/wp-content/uploads/2018/07/Proyecto-de-Jardiner%C3%ADa.jpg" style="width:250px"/>
<p>
Lamentamos informarte que tu cuenta ha sido eliminada por inactividad.
Para volver a activar tu cuenta no tienes mas que volver a registrarte desde nuestra pagina de registro de usuarios.
Este email ha sido generado automaticamente, no respondas a el.
</p>
<p>Si quieres desuscribirte de nuestros descuentos semanales, clickea <a href="https://www.google.com/">AQUI</a></p>

</div>`;

export const sendMailUserDeleted = async (userEmail) => {
    const email = await transporter.sendMail({
        from:"EL EMPORIO DEL JARDIN",
        to:`${userEmail}`,
        subject:"Registro exitoso",
        html: emailTemplate
    });
    return email;
};