const addToCartButtons = document.querySelectorAll('.cartButton');
addToCartButtons.forEach(button => {
  button.addEventListener('click', async (e) => {
    const productId = e.target.getAttribute('data-product-id');
    const userId = e.target.getAttribute('data-user-id');
    const cartId = e.target.getAttribute('data-cart-id');
    console.log(`productId: ${productId}`);
    console.log(`userId: ${userId}`);
    console.log(`cartId: ${cartId}`);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del producto');
      }
      const productData = await response.json();
      // Compara el propietario del producto con el ID del usuario, si coinciden no deja agregar el producto
      if (String(productData.owner) === String(userId)) {
        console.log('No puedes agregar tu propio producto al carrito.');
      } else {
        const cartResponse = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });
        if (cartResponse.ok) {
          console.log('Producto agregado al carrito exitosamente');
        } else {
          console.error('Error al agregar el producto al carrito');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});
