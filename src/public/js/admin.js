/* eslint-disable no-unused-vars */
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

async function editRole (userId) {
  const select = document.getElementById(`edit_role_${userId}`);
  const selectedRole = select.value;
  try {
    const result = await fetch(`/api/users/admin/editrole/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role: selectedRole }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    window.location.href = '/';
  } catch (error) {
    console.log(error);
  }
};

function deleteUser (userId) {
  fetch(`/api/users/admin/${userId}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (response.ok) {
        console.log('Usuario eliminado correctamente');
        window.location.href = '/';
      } else {
        console.error('Error al eliminar el usuario');
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error);
    });
};

// function deleteProduct (productId) {
//   // Obtener el usuario actual desde la plantilla Handlebars (asegúrate de que esté disponible)
//   const userId = '{{user._id}}';
//   // Realizar una solicitud para obtener la lista de todos los usuarios
//   fetch('/api/users')
//     .then((response) => response.json())
//     .then((usersData) => {
//       if (usersData.status === 'succes') {
//         // Verificar si el producto pertenece a alguno de los usuarios
//         const productOwner = product.owner;
//         const userWithEmail = usersData.payload.find((user) => user.email === productOwner);

//         if (userWithEmail && userWithEmail._id === userId) {
//           // Si el propietario coincide con el usuario, enviar el correo
//           async function sendMailProductPremiumDeleted (userId) {
//             const email = await transporter.sendMail({
//               from: 'EL EMPORIO DEL JARDIN',
//               to: `${user.email}`,
//               subject: 'Producto eliminado',
//               html: emailTemplate
//             });
//             return email;
//           };
//         }
//         // Ahora procede a eliminar el producto
//         fetch(`/api/products/${productId}`, {
//           method: 'DELETE'
//         })
//           .then((response) => {
//             if (response.ok) {
//               console.log('Producto eliminado correctamente');
//               window.location.href = '/';
//             } else {
//               console.log('Error al eliminar el producto');
//             }
//           })
//           .catch((error) => {
//             console.error('Error en la solicitud:', error);
//           });
//       } else {
//         console.log('Error al obtener la lista de usuarios');
//       }
//     })
//     .catch((error) => {
//       console.error('Error en la solicitud:', error);
//     });
// };
