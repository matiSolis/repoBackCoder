const addToCartButtons = document.querySelectorAll('.cartButton');
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-product-id');
    const userId = button.getAttribute('data-user-id');
    const cartId = button.getAttribute('data-cart-id');
    console.log(`productId: ${productId}`);
    console.log(`userId: ${userId}`);
    console.log(`cartId: ${cartId}`);
    const productData = {
      userId,
      productId
    };
    if (userId === productData.owner) {
      console.log('No puedes agregar tu propio producto al carrito.');
      return;
    }
    fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
      .then(response => {
        if (response.ok) {
          console.log('Producto agregado al carrito exitosamente');
        } else {
          console.error('Error al agregar el producto al carrito');
        }
      })
      .catch(error => {
        console.error('Error de red:', error);
      });
  });
});
