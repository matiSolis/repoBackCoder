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

function deleteProduct (productId) {
  fetch(`/api/products/${productId}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (response.ok) {
        console.log('Producto eliminado correctamente');
        window.location.href = '/';
      } else {
        console.log('Error al eliminar el producto');
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error);
    });
};
