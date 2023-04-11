const BASE_URL = 'https://fakestoreapi.com/products';
let store = JSON.parse(localStorage.getItem("data")) || [];
/**
 * DOMCONTENT LOADED
 * LOAD THE window
 */
window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');

  storage = JSON.parse(localStorage.getItem('data')) || [];

  const totalAmountEl = document.getElementById('totalamount');
  const totalEl = document.querySelector('total');
  let totalAmount = 0;
  const searchEl = document.getElementById('search');
  let productDetails = [],
    searchData = '',quantity = 0;

  const renderProducts = (products) => {
    productDetails = [...products];
    createProductElements(productDetails);
  };
  const createProductElements = (productDetails) => {
    let mainContainer = document.getElementById('container');
    for (let product of productDetails) {
      let card = document.createElement('div');
      card.className = 'product-card';
      card.style.height = '350px';
      card.style.width = '350px';
      mainContainer.appendChild(card);

      let createImg = document.createElement('img');
      createImg.className = 'card-img';
      createImg.src = product.image;
      createImg.setAttribute('width', '150px');
      createImg.setAttribute('height', '150px');
      card.appendChild(createImg);

      let createPara = document.createElement('p');
      createPara.className = 'card-title';
      createPara.textContent = product.title;
      createPara.style.margin = '10px';
      card.appendChild(createPara);

      let createPrice = document.createElement('p');
      createPrice.className = 'card-price';
      createPrice.textContent = `$${product.price.toFixed(2)}`;
      createPrice.style.margin = '20px';
      card.appendChild(createPrice);

      let createAddDeleteDiv = document.createElement('div');
      createAddDeleteDiv.className = 'card-addDelete';
      createAddDeleteDiv.style.padding = '5px';
      createAddDeleteDiv.style.display = 'flex';
      createAddDeleteDiv.style.justifyContent = 'center';
      createAddDeleteDiv.style.alignItems = 'center';
      card.appendChild(createAddDeleteDiv);


      let decrementBtn = document.createElement('button');
      decrementBtn.className = 'decrement';
      decrementBtn.style.border = '2px solid black';
      decrementBtn.style.marginLeft = '5px';
      decrementBtn.style.fontSize = '20px';
      decrementBtn.style.width = '25px';
      decrementBtn.style.height = '25px';
      decrementBtn.innerText='-';
      decrementBtn.style.textAlign = 'center';
      createAddDeleteDiv.appendChild(decrementBtn);

    
    
    //   let searchItems = store.find((item) => item.id === selectedItemId.id);
      let quantityEl = document.createElement('button');
      let id=`${product.id}`;
      quantityEl.id="btn"+`${id}`;
      quantityEl.setAttribute('data-mydata', `${product.id}`)
      quantityEl.style.margin = '0 10px';
      quantityEl.style.width = '25px';
      quantityEl.style.height = '25px';
      quantityEl.innerText='0'
      createAddDeleteDiv.appendChild(quantityEl);


      let incrementBtn = document.createElement('button');
      incrementBtn.className= 'increment';
      incrementBtn.style.border = '2px solid black';
      incrementBtn.style.width = '25px';
      incrementBtn.style.marginRight = '5px';
      incrementBtn.style.height = '25px';
      incrementBtn.style.fontSize = '20px';
      incrementBtn.innerText='+';
      createAddDeleteDiv.appendChild(incrementBtn);

      let createButton = document.createElement('button');
      createButton.className = 'card-addtoCart';
      createButton.setAttribute('id', 'buyBtn');
      createButton.innerText = 'Buy';
      createButton.style.margin = '20px auto';
      createButton.style.padding = '5px';
      card.appendChild(createButton);
      
      incrementBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityEl.innerText);
         quantityEl.innerText = quantity + 1;
        // let productTotalQuantity = product.price * quantity;
        totalAmount += product.price;
        // totalAmountEl.innerHTML = `$${totalAmount.toFixed(2)}`;

        // Update the cart data in localStorage
        let cartProduct = store.find((item) => item.id === product.id);
        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            store.push({ id: product.id, quantity: 1 });
        }

       localStorage.setItem('data', JSON.stringify(store));

        
      });
      
      decrementBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityEl.innerText);
        if (quantity > 0) {
          quantityEl.innerText = quantity - 1;
        //   let productTotalQuantity = product.price * quantity;
          totalAmount -= product.price;
        //   totalAmountEl.innerHTML = `$${totalAmount.toFixed(2)}`;
        
           // Update the cart data in localStorage
            let cartProduct = store.find((item) => item.id === product.id);
            if (cartProduct) {
                cartProduct.quantity -= 1;
                if (cartProduct.quantity === 0) {
                    store = store.filter((item) => item.id !== product.id);
                }
           }

           localStorage.setItem('data', JSON.stringify(store));
        }
      });
      createButton.addEventListener('click', () => {
        // let quantity = parseInt(quantityEl.innerText);
        // console.log(quantity);
        // let productTotalQuantity = product.price * quantity;
        // totalAmount += productTotalQuantity;
      
        // Add the product to the cart
        let cartProduct = store.find((item) => item.id === product.id);
        if (cartProduct) {
          cartProduct.quantity += quantity;
        } else {
          store.push({ id: product.id, quantity: quantity });
        }
      
        // Update the total amount in the UI
        totalAmountEl.innerHTML = `$${totalAmount.toFixed(2)}`;
      
        // Save the updated cart data to localStorage
        localStorage.setItem('data', JSON.stringify(store));
      });
      
    
    }
}

  const searchfilterHandler = (e) => {
    console.log(e.target.value);
    const searchInput = e.target.value;
    const searchQuery = searchInput.toLowerCase();
    let productCards = document.querySelectorAll('.product-card');

    for (let i = 0; i < productCards.length; i++) {
      if (productCards[i].innerText.toLowerCase().includes(searchQuery)) {
        productCards[i].classList.remove('is-hidden');
      } else {
        // Otherwise, add the class.
        productCards[i].classList.add('is-hidden');
      }
    }
  };

  (async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const products = await response.json();
    renderProducts(products);
  })();


  document.addEventListener('keyup', searchfilterHandler);
});

// https://dev.to/themodernweb/how-to-make-an-e-commerce-website-with-html-css-and-js-3aon
