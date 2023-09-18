const finalizarCompraButton = document.getElementById('finalizarCompraButton');
finalizarCompraButton.addEventListener('click', (e) => {
  e.preventDefault();
  const cartId = e.target.dataset.cartId;
  fetch(`/api/carts/${cartId}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.error('Error en la compra.');
      }
    })
    .then((data) => {
      window.location.href = '/';
      console.log('Compra exitosa y correo electrónico enviado.');
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error);
    });
});
