const addToCartButtons = document.querySelectorAll('.cartButton');

addToCartButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const productId = e.target.dataset.id;
    const cartId = e.target.dataset.cartId;
    const userId = e.target.dataset.userId;
    console.log(userId);
    console.log(cartId);
    console.log(productId);
    // Todo el código siguiente es para comparar la key owner del producto con el id del usuario,
    // si son iguales no debería dejarte agregar ese producto al carrito.
    fetch(`/api/products/${productId}`, {
      method: 'GET'
    })
      .then((productResponse) => {
        if (productResponse.status === 200) {
          return productResponse.json();
        } else {
          console.error('No se pudo obtener el producto.');
        }
      })
      .then((product) => {
        if (product.owner === userId) {
          alert('No puedes agregar tu propio producto al carrito.');
        } else {
          return fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });
        }
      })
      .then((addToCartResponse) => {
        if (addToCartResponse.status === 200) {
          alert('Producto agregado al carrito con éxito.');
        } else {
          console.error('Error al agregar el producto al carrito.');
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  });
});
