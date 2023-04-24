const totalPriceElement = document.getElementById('total-price');
let totalPrice = 0;

function calculateTotalPrice() {
    // Находим все карточки товаров на странице
    const productCards = document.querySelectorAll('.product');
  
    // Обнуляем общую цену
    totalPrice = 0;
  
    // Складываем цены всех товаров
    productCards.forEach((productCard) => {
      const quantityInput = productCard.querySelector('input[type="text"]');
      const productQuantity = parseInt(quantityInput.value);
      const productPrice = parseFloat(productCard.querySelector('.product-price').textContent);
  
      totalPrice += productQuantity * productPrice;
    });
  
    // Обновляем общую цену на странице
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }
  
  // Обновляем общую цену при загрузке страницы или обновлении
  window.addEventListener('load', calculateTotalPrice);

// Функция для обновления общей цены
function updateTotalPrice(quantity, price) {
  totalPrice += quantity * price;
  totalPriceElement.textContent = totalPrice.toFixed(2) + ' руб.';
}

// Находим все карточки товаров на странице
const productCards = document.querySelectorAll('.product');

// Добавляем обработчики событий на кнопки "В корзину" и "+" и "-"
productCards.forEach((productCard) => {
  const minusBtn = productCard.querySelector('.minus-btn');
  const plusBtn = productCard.querySelector('.plus-btn');
  const deleteBtn = productCard.querySelector('.delete');
  const quantityInput = productCard.querySelector('input[type="text"]');
  const productId = productCard.dataset.productId;

  // Обработчик события для кнопки "+"
  plusBtn.addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value);
    const productQuantity = 1;
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = parseFloat(productCard.querySelector('.product-price').textContent);
    quantity++;
    quantityInput.value = quantity;
    
    // Отправляем запрос на сервер для добавления товара в корзину
    fetch('/add_to_cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `product_id=${productId}&quantity=${productQuantity}`
    })
    .then(response => response.json())
    .then(data => {
      // Обновляем интерфейс в соответствии с изменениями в корзине
      if (data.success) {
        console.log(`Количество товара "${productName}" увеличилось на 1.`);

        // Вызываем функцию для обновления общей цены
        updateTotalPrice(productQuantity, productPrice);
      }
    })
  });
  
  // Обработчик события для кнопки "-"
  minusBtn.addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value);
    const productQuantity = -1;
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = parseFloat(productCard.querySelector('.product-price').textContent);
    if (quantity > 1) {
      quantity--;
      quantityInput.value = quantity;

      // Отправляем запрос на сервер для добавления товара в корзину
      fetch('/add_to_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `product_id=${productId}&quantity=${productQuantity}`
      })
      .then(response => response.json())
      .then(data => {
        // Обновляем интерфейс в соответствии с изменениями в корзине
        if (data.success) {
          console.log(`Количество товара "${productName}" уменьшилось на 1.`);

          // Вызываем функцию для обновления общей цены
          updateTotalPrice(productQuantity, productPrice);
        }
      })
    }
  });

  deleteBtn.addEventListener('click', () => {
    const productName = productCard.querySelector('.product-name').textContent;
    // Отправляем запрос на сервер для добавления товара в корзину
    fetch('/remove_from_cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `product_id=${productId}`
    })
    .then(response => response.json())
    .then(data => {
      // Обновляем интерфейс в соответствии с изменениями в корзине
      if (data.success) {
        console.log(`Товар "${productName}" удалён.`);

        location.reload();
      }
    })
  });
});


const designBtn = document.querySelector('.design');
designBtn.addEventListener('click', () => {
  window.location.href = "/design";
})