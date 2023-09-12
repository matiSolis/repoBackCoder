import { transporter } from '../config/gmail.js';

const emailTemplate = `<div>
<h1>PRODUCTO ELIMINADO</h1>
<img src="https://paissano.com/wp-content/uploads/2018/07/Proyecto-de-Jardiner%C3%ADa.jpg" style="width:250px"/>
<p>
Lamentamos informarte que tu producto no cumple con el reglamento del sitio y ha sido eliminado por un administrador.
Para obtener mas informacion, comunicate con nuestro servicio de atencion al cliente.
Este email ha sido generado automaticamente, no respondas a el.
</p>
<p>Si quieres desuscribirte de nuestros descuentos semanales, clickea <a href="https://www.google.com/">AQUI</a></p>

</div>`;

export const sendMailProductPremiumDeleted = async (user) => {
  const email = await transporter.sendMail({
    from: 'EL EMPORIO DEL JARDIN',
    to: `${user.email}`,
    subject: 'Producto eliminado',
    html: emailTemplate
  });
  return email;
};
