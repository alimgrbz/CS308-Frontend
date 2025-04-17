export const addToLocalCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
  
    const index = existingCart.findIndex(item => item.productId === product.productId);
    
    if (index > -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
  
    localStorage.setItem('guest_cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cart-updated'));
    console.log('🛒 Updated Guest Cart:', existingCart);
  };
  