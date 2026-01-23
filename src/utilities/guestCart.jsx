export const getGuestCart = () => {
  const cart = localStorage.getItem("guest_cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveGuestCart = (cart) => {
  localStorage.setItem("guest_cart", JSON.stringify(cart));
};

export const clearGuestCart = () => {
  localStorage.removeItem("guest_cart");
};
