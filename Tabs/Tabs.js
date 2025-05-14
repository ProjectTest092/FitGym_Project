// // let addToCart = document.querySelectorAll(".add-to-cart");

// // addToCart.forEach((cart) =>{
// //      cart.addEventListener("click",() => {
// //           alert("Item add to cart");
// //      });
// // });

document.querySelectorAll('.add-to-cart').forEach(button => {
     button.addEventListener('click', () => {
          const productTitle = button.parentElement.querySelector('.product-title').innerText;
          alert(`Added "${productTitle}" to cart!`);
     });
});

let cart = [];

function addToCart(productName, productPrice) {
     const product = {
          name: productName,
          price: productPrice
     };

     cart.push(product);
     alert(`${productName} has been added to your cart!`);
     console.log(cart); // For debugging purposes, you can see the cart in the console
}

let minus = document.getElementById("#minus").onclick(alert('you clicked the button'));

// minus.onclick(alert('you clicked the button'));

function removeFromCart(productName, productPrice) {
     const product = {
          name: productName,
          price: productPrice
     };

     cart.pop(product);
     alert(`${productName} has been added to your cart!`);
     console.log(cart); // For debugging purposes, you can see the cart in the console
}


function addToCart(title, price) {
    // Create a cart item object
    const cartItem = { title, price };

    // Retrieve existing cart items from local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add the new item to the cart
    cart.push(cartItem);

    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Optionally, navigate to the cart page
    // window.location.href = 'cart.html';
  }