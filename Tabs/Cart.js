// User Authentication
let currentUser = null;

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('signupBtn').style.display = 'none';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('userName').textContent = currentUser.username;
    } else {
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('signupBtn').style.display = 'block';
        document.getElementById('userInfo').style.display = 'none';
    }
}

// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.cartItems = [];
        this.total = 0;
        this.cartContainer = document.getElementById('cart-items');
        this.totalElement = document.getElementById('cart-total');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.emptyCartMessage = document.getElementById('empty-cart-message');
        
        this.checkoutBtn.addEventListener('click', () => this.checkout());
        this.loadCartItems();
    }

    async loadCartItems() {
        if (!currentUser) {
            this.showEmptyCart();
            return;
        }

        try {
            const response = await fetch(`api/cart.php?user_id=${currentUser.user_id}`);
            const data = await response.json();
            
            if (response.ok) {
                this.cartItems = data;
                this.updateCartDisplay();
            } else {
                console.error('Error loading cart items:', data.message);
                this.showEmptyCart();
            }
        } catch (error) {
            console.error('Error loading cart items:', error);
            this.showEmptyCart();
        }
    }

    async addItem(product) {
        if (!currentUser) {
            alert('Please login to add items to cart');
            return;
        }

        try {
            const response = await fetch('api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: currentUser.user_id,
                    product_title: product.title,
                    product_price: product.price,
                    product_image: product.image
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                await this.loadCartItems();
                this.showToast('Item added to cart');
            } else {
                console.error('Error adding item to cart:', data.message);
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    }

    async removeItem(cartItemId) {
        if (!currentUser) return;

        try {
            const response = await fetch('api/cart.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: currentUser.user_id,
                    cart_item_id: cartItemId
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                await this.loadCartItems();
            } else {
                console.error('Error removing item from cart:', data.message);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }

    async updateQuantity(cartItemId, newQuantity) {
        if (!currentUser) return;

        try {
            const response = await fetch('api/cart.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: currentUser.user_id,
                    cart_item_id: cartItemId,
                    quantity: newQuantity
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                await this.loadCartItems();
            } else {
                console.error('Error updating item quantity:', data.message);
            }
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    }

    updateCartDisplay() {
        if (this.cartItems.length === 0) {
            this.showEmptyCart();
            return;
        }

        this.cartContainer.innerHTML = '';
        this.total = 0;

        this.cartItems.forEach(item => {
            const itemTotal = item.product_price * item.quantity;
            this.total += itemTotal;

            const cartItemElement = this.createCartItemElement(item);
            this.cartContainer.appendChild(cartItemElement);
        });

        this.totalElement.textContent = `$${this.total.toFixed(2)}`;
        this.checkoutBtn.disabled = false;
        this.emptyCartMessage.style.display = 'none';
    }

    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.product_image}" alt="${item.product_title}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.product_title}</h3>
                <p>$${item.product_price}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.cart_item_id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.cart_item_id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="cart.removeItem(${item.cart_item_id})">×</button>
        `;
        return cartItem;
    }

    showEmptyCart() {
        this.cartContainer.innerHTML = '';
        this.total = 0;
        this.totalElement.textContent = '$0.00';
        this.checkoutBtn.disabled = true;
        this.emptyCartMessage.style.display = 'block';
    }

    checkout() {
        if (!currentUser) {
            alert('Please login to checkout');
            return;
        }

        if (this.cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Here you would typically redirect to a checkout page
        // or show a checkout form
        alert('Proceeding to checkout...');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    window.cart = new ShoppingCart();
});

let emptyMsgContainer = document.querySelector(".empty-msg-container");

let msgContainer = document.getElementsByClassName("msg-container");

if(cart == []){
     // emptyMsgContainer.classList.remove("hide");
     emptyMsgContainer.classList.add("hide");
}

let button = document.getElementById("btn");
let removeBtn = document.getElementById("rm-btn");

let count = 1;

button.addEventListener("click", () => {
     const el = document.createElement("div");
     el.classList.add("add");
     el.innerText = `inserted ${count}`;
     emptyMsgContainer.appendChild(el);
     count++;
     // emptyMsgContainer.removeChild(el);
     removeDiv();
     function removeDiv() {
          removeBtn.addEventListener("click", () => {
               emptyMsgContainer.removeChild(el);
          });
     }
});

function removeDiv(){
     removeBtn.addEventListener("click", () => {
          emptyMsgContainer.removeChild(el);
     });
}

// let addDiv = document.createElement("div");
// button.addEventListener("click", addNewDiv);

// function addNewDiv(){
//      addDiv.classList.add("add");
//      addDiv.innerText = "click me!";
     
//      emptyMsgContainer.append(addDiv);
// }





