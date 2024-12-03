const cartContainer = document.getElementById('cart-container');

// Function to load cart items from localStorage
const loadCartItems = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        return;
    }

    cartContainer.innerHTML = ''; // Clear previous items
    cartItems.forEach((item, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('cart-item');

        cardElement.innerHTML = `
            <div class="cart-item-header">
                <img src="${item.imageUrl || 'placeholder.jpg'}" alt="${item.title || 'Job Image'}" class="card-image" />
                <h2>${item.title || 'Untitled Job'}</h2>
            </div>
            <div class="cart-item-content">
                <p>${item.description || 'No description available.'}</p>
            </div>
            <div class="button-container">
                <button class="remove-button" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="apply-button" data-url="${item.applyLink || '#'}">Apply</button>
            </div>
        `;

        cartContainer.appendChild(cardElement);

        // Add event listener for the apply button
        cardElement.querySelector('.apply-button').addEventListener('click', (event) => {
            const url = event.target.getAttribute('data-url');
            if (url && url !== '#') {
                window.location.href = url; // Redirect to the job application link
            } else {
                alert('No application link available for this job.');
            }
        });

        // Add event listener for the remove button
        cardElement.querySelector('.remove-button').addEventListener('click', () => {
            removeCartItem(index);
        });
    });
};

// Function to remove an item from the cart
const removeCartItem = (index) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (index < 0 || index >= cartItems.length) {
        console.error('Invalid index:', index);
        return;
    }

    cartItems.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update localStorage
    loadCartItems(); // Reload the cart items
};

document.querySelector('.cart-logo').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    window.location.href = 'cart.html'; // Redirect to cart.html
});

// Load cart items when the page is loaded
document.addEventListener('DOMContentLoaded', loadCartItems);
