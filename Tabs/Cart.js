// Get cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const emptyMsgContainer = document.querySelector(".empty-msg-container");
const msgContainer = document.querySelector(".msg-container");

// Initialize total price
let totalPrice = 0;

// Function to show loading state
function showLoading() {
    cartItemsContainer.innerHTML = '<div class="loading">Loading cart items...</div>';
}

// Function to handle image loading errors
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/150?text=No+Image';
    img.alt = 'Image not available';
}

// Function to update cart display
function updateCartDisplay() {
    showLoading();
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
                    <img src="${item.image}" alt="${item.title}" onerror="handleImageError(this)" />
                </div>
                <div class="item-info">
                    <h3>${item.title}</h3>
                    <p class="price">₹${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-index="${index}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity || 1}</span>
                    <button class="quantity-btn increase" data-index="${index}">
                        <i class="fas fa-plus"></i>
                    </button>
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

    // Update total price display with animation
    const formattedTotal = totalPrice.toFixed(2);
    totalPriceElement.style.opacity = '0';
    setTimeout(() => {
        totalPriceElement.innerText = `Total Price: ₹${formattedTotal}`;
        totalPriceElement.style.opacity = '1';
    }, 200);
}

// Function to update item quantity with animation
function updateQuantity(index, change) {
    const item = cartItems[index];
    if (!item.quantity) {
        item.quantity = 1;
    }
    
    const newQuantity = Math.max(1, item.quantity + change);
    if (newQuantity !== item.quantity) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Add animation class
        const quantityElement = document.querySelector(`[data-index="${index}"]`).closest('.cart-item');
        quantityElement.classList.add('updating');
        setTimeout(() => {
            updateCartDisplay();
            quantityElement.classList.remove('updating');
        }, 300);
    }
}

// Function to remove item from cart with animation
function removeFromCart(index) {
    const itemElement = document.querySelector(`[data-index="${index}"]`).closest('.cart-item');
    itemElement.classList.add('removing');
    
    setTimeout(() => {
        cartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartDisplay();
    }, 300);
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
    
    const button = document.getElementById('checkout-button');
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate checkout process
    setTimeout(() => {
        alert('Proceeding to checkout...');
        localStorage.removeItem('cart');
        updateCartDisplay();
        button.disabled = false;
        button.innerHTML = 'Checkout';
    }, 1500);
});

// Clear cart button functionality
document.getElementById('clear-cart-button').addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert('Your cart is already empty!');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        const button = document.getElementById('clear-cart-button');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';
        
        setTimeout(() => {
            localStorage.removeItem('cart');
            cartItems.length = 0;
            updateCartDisplay();
            button.disabled = false;
            button.innerHTML = 'Clear Cart';
        }, 1000);
    }
});

// Initial cart display
updateCartDisplay();






