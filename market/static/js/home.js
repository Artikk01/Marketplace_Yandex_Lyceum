// Находим все карточки товаров на странице
const productCards = document.querySelectorAll('.product-card');

// Добавляем обработчики событий на кнопки "В корзину" и "+" и "-"
productCards.forEach((productCard) => {
  const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
  const minusBtn = productCard.querySelector('.minus-btn');
  const plusBtn = productCard.querySelector('.plus-btn');
  const quantityInput = productCard.querySelector('input[type="text"]');
  const productId = productCard.dataset.productId;

  // Обработчик события для кнопки "В корзину"
  function addToCart() {
    const productQuantity = parseInt(quantityInput.value);
    const productName = productCard.querySelector('.product-name').textContent;

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
          console.log(`Товар "${productName}" добавлен в корзину.`);
          addToCartBtn.removeEventListener('click', addToCart);
          addToCartBtn.classList.add('added-to-cart');
          addToCartBtn.addEventListener('click', () => {
            window.location.href = '/cart';})
          addToCartBtn.textContent = 'В корзине'

           // Обработчик события для кнопки "+"
          plusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value);
            const productQuantity = 1;
            const productName = productCard.querySelector('.product-name').textContent;
            console.log(quantity)
            quantity++;
            quantityInput.value = quantity;
            console.log(quantity)
            
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

              }
            })
          });
              
          // Обработчик события для кнопки "-"
          minusBtn.addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value);
            const productQuantity = -1;
            const productName = productCard.querySelector('.product-name').textContent;
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
                }
              })
            }
          });
        }
      })
      .catch(error => {
        console.log(`Ошибка при добавлении товара в корзину: "${error}"`);
    });
  }
  addToCartBtn.addEventListener('click', addToCart);


  const addedToCartBtn = productCard.querySelector('.added-to-cart');
  if (addedToCartBtn) {
    addedToCartBtn.removeEventListener('click', addToCart);
    addedToCartBtn.addEventListener('click', () => {
      window.location.href = '/cart';});

      // Обработчик события для кнопки "+"
    plusBtn.addEventListener('click', () => {
      let quantity = parseInt(quantityInput.value);
      const productQuantity = 1;
      const productName = productCard.querySelector('.product-name').textContent;
      console.log(quantity)
      quantity++;
      console.log(quantity)
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

        }
      })
    });
        
    // Обработчик события для кнопки "-"
    minusBtn.addEventListener('click', () => {
      let quantity = parseInt(quantityInput.value);
      const productQuantity = -1;
      const productName = productCard.querySelector('.product-name').textContent;
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

          }
        })
      }
    });
  } else {
      // Обработчик события для кнопки "-"
    minusBtn.addEventListener('click', () => {
      if (!(productCard.querySelector('.added-to-cart'))) {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
          quantity--;
          quantityInput.value = quantity;
        }
      }
    });

    // Обработчик события для кнопки "+"
    plusBtn.addEventListener('click', () => {
      if (!(productCard.querySelector('.added-to-cart'))) {
        let quantity = parseInt(quantityInput.value);
        quantity++;
        quantityInput.value = quantity;
      }
    });
  }
});
