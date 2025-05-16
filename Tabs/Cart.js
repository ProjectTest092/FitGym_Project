// Get cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const emptyMsgContainer = document.querySelector(".empty-msg-container");
const msgContainer = document.querySelector(".msg-container");

// Initialize total price
let totalPrice = 0;

// Function to update cart display
function updateCartDisplay() {
    // Clear previous items
    cartItemsContainer.innerHTML = '';
    totalPrice = 0;

    if (cartItems.length === 0) {
        emptyMsgContainer.classList.remove("hide");
        msgContainer.classList.add("hide");
        return;
    }

    emptyMsgContainer.classList.add("hide");
    msgContainer.classList.remove("hide");

    // Display each cart item
    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="item-details">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}" />
                </div>
                <div class="item-info">
                    <h3>${item.title}</h3>
                    <p class="price">₹${item.price}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity || 1}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
                <div class="item-total">
                    <p>Total: ₹${((item.quantity || 1) * item.price).toFixed(2)}</p>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
        totalPrice += (item.quantity || 1) * item.price;
    });

    // Update total price display
    totalPriceElement.innerText = `Total Price: ₹${totalPrice.toFixed(2)}`;
}

// Function to update item quantity
function updateQuantity(index, change) {
    if (!cartItems[index].quantity) {
        cartItems[index].quantity = 1;
    }
    
    cartItems[index].quantity = Math.max(1, cartItems[index].quantity + change);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartDisplay();
}

// Function to remove item from cart
function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartDisplay();
}

// Add event listeners for cart interactions
cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-item')) {
        const index = e.target.closest('.remove-item').dataset.index;
        removeFromCart(index);
    } else if (e.target.closest('.decrease')) {
        const index = e.target.closest('.decrease').dataset.index;
        updateQuantity(index, -1);
    } else if (e.target.closest('.increase')) {
        const index = e.target.closest('.increase').dataset.index;
        updateQuantity(index, 1);
    }
});

// Checkout button functionality
document.getElementById('checkout-button').addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Here you can implement your checkout logic
    alert('Proceeding to checkout...');
    // Clear cart after successful checkout
    // localStorage.removeItem('cart');
    // updateCartDisplay();
});

// Initial cart display
updateCartDisplay();






