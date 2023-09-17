const addToCartButtons = document.querySelectorAll('.cartButton');

addToCartButtons.forEach((button) => {
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    const productId = e.target.dataset.id;
    const cartId = e.target.dataset.cartId;
    // Todo el codigo siguiente es para comparar la key owner del producto con el id del user,
    // si son iguales no deberia dejarte agregar ese producto al cart
    const userId = 'aquí_debes_obtener_el_id_del_usuario_actual';
    try {
      const productResponse = await fetch(`/api/products/${productId}`, {
        method: 'GET'
      });
      if (productResponse.status === 200) {
        const product = await productResponse.json();
        if (product.owner === userId) {
          alert('No puedes agregar tu propio producto al carrito.');
          // ACA TERMINA LA VERIFICACION DE LA KEY OWNER CON EL ID DEL USER
          // ================================================================
        } else {
          const addToCartResponse = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });

          if (addToCartResponse.status === 200) {
            alert('Producto agregado al carrito con éxito.');
          } else {
            console.error('Error al agregar el producto al carrito.');
          }
        }
      } else {
        console.error('No se pudo obtener el producto.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  });
});
