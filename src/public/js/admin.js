/* eslint-disable no-unused-vars */
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
      } else {
        console.error('Error al eliminar el usuario');
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error);
    });
};
