let products_list = [];
fetch('/shoes_store_tg/Assets/db.json')
  .then(response => response.json())
  .then(products => {
    products_list = products;
    const catalog = document.getElementById('product-catalog');
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <h2>${product.brand} ${product.model}</h2>
        <img src="${product.image}" alt="${product.brand} ${product.model}" width="300" height="220" />
        <div class="color-label">Колір: ${product.color}</div>
        <div class="product-price">${product.price} грн</div>
        <select class="size-select">
          ${product.variants.map(v => `<option value="${v.id}">${v.size}</option>`).join('')}
        </select>
        <button onclick="addToCart(this)">Замовити</button>
      `;  
      catalog.appendChild(card);
    });
  });


  let cart = [];
function updateCartQuantity() {
  const quantityEl = document.getElementById('cart-quantity');
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalCount > 0) {
    quantityEl.style.display = 'flex';
    quantityEl.textContent = totalCount;
  } else {
    quantityEl.style.display = 'none';
  }
}

function addToCart(button) {
  const card = button.closest('.product-card');
  const sizeSelect = card.querySelector('.size-select');
  const variantId = sizeSelect.value;

  const existingItem = cart.find(item => item.id === variantId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: variantId, quantity: 1 });
  }
  updateCartQuantity();
  alert(`У кошику ${cart.length} товарів`);
}
function showCart() {
  renderCartItems();
  document.getElementById('cart-popup').style.display = 'block';
}

function hideCart() {
  document.getElementById('cart-popup').style.display = 'none';
}

function findProductInfo(id) {
  for (const product of products_list) {
    for (const variant of product.variants) {
      if (variant.id == id) {
        return {
          brand: product.brand,
          model: product.model,
          size: variant.size
        };
      }
    }
  }
  return null;
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  container.innerHTML = cart.map(item =>{
    const info = findProductInfo(item.id);
      if (!info) return `<div>Невідомий товар</div>`;
      return `<div><strong>Товар: ${info.brand} ${info.model} Кількість: ${item.quantity}</strong></div>`;
  }).join('');
}
setTimeout(() => {
  document.getElementById('customer-name').focus();
}, 100);
document.getElementById('order-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const delivery = document.getElementById('customer-delivery').value.trim();
  const id = document.getElementById('customer-id').value.trim();

  if (!name || !phone || !delivery || !id) {
    alert('Будь ласка, заповніть всі поля');
    return false; // Не відправляти форму!
  }

  const orderData = {
    customer: { name, phone, delivery, id },
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
