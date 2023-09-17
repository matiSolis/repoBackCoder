/* eslint-disable no-unused-vars */
function editRole (userId) {
  const select = document.getElementById(`edit_role_${userId}`);
  const newRole = select.value;
  fetch(`/api/users/admin/editrole/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ role: newRole }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      if (response.ok) {
        console.log('Rol actualizado correctamente');
      } else {
        console.error('Error al actualizar el rol');
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error);
    });
};

function deleteUser (userId) {
  fetch(`/api/users/admin/${userId}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (response.ok) {
        console.log('Usuario eliminado correctamente');
      } else {
        console.error('Error al eliminar el usuario');
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error);
    });
};
