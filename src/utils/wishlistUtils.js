export const addToLocalWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
    const exists = wishlist.some(item => item.productId === product.productId);
    if (!exists) {
      wishlist.push(product);
      localStorage.setItem('guest_wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlist-updated'));
    }
  };
  
  export const getLocalWishlist = () => {
    return JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
  };
  
  export const removeFromLocalWishlist = (productId) => {
    const wishlist = getLocalWishlist().filter(item => item.productId !== productId);
    localStorage.setItem('guest_wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlist-updated'));
  };
  
  export const clearLocalWishlist = () => {
    localStorage.removeItem('guest_wishlist');
    window.dispatchEvent(new Event('wishlist-updated'));
  };
  
  export const isInLocalWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
    return wishlist.some(item => item.productId === productId);
  };