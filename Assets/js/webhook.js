document.getElementById('order-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();

  if (!name || !phone) {
    alert('Будь ласка, заповніть всі поля');
    return false; // Не відправляти форму!
  }

  const orderData = {
    customer: { name, phone },
    items: cart
  };

  fetch('https://hook.eu2.make.com/1ettzvhwvhnmag3f5otfig2ospqw2nd9', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
    .then(response => {
      if (response.ok) {
        alert('Замовлення надіслано!');
        cart = [];
        updateCartQuantity();
        hideCart();
      } else {
        alert('Помилка при відправці замовлення');
      }
    })
    .catch(() => alert('Помилка мережі'));
});