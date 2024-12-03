document.addEventListener('DOMContentLoaded', () => {
    // Check if the device is mobile
    if (window.innerWidth > 600) { // You can adjust this width as needed
        // Redirect to the desktop warning page
        window.location.href = 'desktop-warning.html'; // Redirect to the new page
    }

    // Other existing code...
});
// Function to close the warning
function closeWarning() {
    document.getElementById('desktop-warning').style.display = 'none'; // Hide the warning
    document.body.style.pointerEvents = 'auto'; // Re-enable interactions

    // Optionally, you can redirect to a different page or display a message
}


const totalCards = 6; // Fixed number of visible cards

const cards = document.querySelectorAll('.card'); // All card elements in the DOM
const angleIncrement = 360 / totalCards; // Angle between each card
let currentIndex = 0; // Tracks the currently visible card
let rotationCount = 0; // Tracks the number of rotations completed

const setupCards = () => {
    cards.forEach((card, index) => {
        const angle = angleIncrement * (index - currentIndex); // Calculate angle based on current index
        card.style.transform = `rotateY(${angle}deg) translateZ(200px)`; // Adjust translateZ for spacing

        // Add or remove blur class based on whether the card is facing the user
        if (index === currentIndex) {
            card.classList.remove('blurred'); // Remove blur from the card facing the user
        } else {
            card.classList.add('blurred'); // Add blur to all other cards
        }
    });
};



let previousIndex = -1; // Track the previous index

const rotateCards = (direction) => {
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % totalCards; // Wrap around the card content list
    } else if (direction === 'prev') {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards; // Wrap around
    }

    setupCards(); // Apply the new rotation and blur effect to cards

    // Check if the current index has changed
    if (currentIndex !== previousIndex) {
        // Update data only after completing a full rotation if the index changes
        if (currentIndex === 0 && previousIndex === totalCards - 1) {
            updateCardContents(); // Update contents after a full rotation
        }
        previousIndex = currentIndex; // Update previous index
    }
};

// Function to update the content of each card based on the current index
const updateCardContents = () => {
    cards.forEach((card, index) => {
        const cardContent = cardContents[(currentIndex + index) % cardContents.length];

        // Split description into points based on commas and display them as bullet points
        const descriptionPoints = cardContent.description.split(',').map(point => `<li>${point.trim()}</li>`).join('');

        card.innerHTML = `
            <img src="${cardContent.imageUrl || 'default-image.png'}" alt="${cardContent.title}" class="card-image" />
            <h2>${cardContent.title}</h2>
            <ul>${descriptionPoints}</ul>
            <div class="button-container">
                <button class="apply-button" data-url="${cardContent.applyLink}">Apply</button>
                <button class="add-to-cart-button" data-title="${cardContent.title}" data-description="${cardContent.description}" data-image="${cardContent.imageUrl}">Add to cart</button>
            </div>
        `;
    });

    // Add event listeners to the apply buttons
    document.querySelectorAll('.apply-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const url = event.target.getAttribute('data-url');
            window.location.href = url; // Redirect to the URL
        });
    });

    // Add event listeners to the add-to-cart buttons
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const title = event.target.getAttribute('data-title');
            const description = event.target.getAttribute('data-description');
            const imageUrl = event.target.getAttribute('data-image');

            // Create a cart item object
            const cartItem = { title, description, imageUrl };

            // Get existing cart items from localStorage
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

            // Add the new item to the cart
            cartItems.push(cartItem);

            // Save the updated cart back to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));


            // Change button background color and text color
            button.style.backgroundColor = 'black'; // Set background color to black
            button.style.color = 'white'; // Set text color to white

 
        });
    });
};

// Event listeners for user interactions
const handleKeyPress = (e) => {
    if (e.key === 'ArrowRight') {
        rotateCards('next');
    } else if (e.key === 'ArrowLeft') {
        rotateCards('prev');
    }
};

// Mouse Wheel Control
const handleMouseWheel = (event) => {
    if (event.deltaY > 0) {
        rotateCards('next');
    } else {
        rotateCards('prev');
    }
};

// Touch Control
let startX = 0;
const handleTouchStart = (event) => {
    startX = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
    event.preventDefault(); // Prevent default scrolling
    const touchX = event.touches[0].clientX;
    const threshold = 50; // Increased threshold for touch movement
    if (startX > touchX + threshold) {
        rotateCards('next');
        startX = touchX; // Update start position
    } else if (startX < touchX - threshold) {
        rotateCards('prev');
        startX = touchX; // Update start position
    }
};

const updateAddToCartButtons = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

    addToCartButtons.forEach(button => {
        const title = button.getAttribute('data-title');
        const isInCart = cartItems.some(item => item.title === title);

        if (isInCart) {
            button.remove(); // Remove the button from the card
        } else {
            button.innerText = 'Add to Cart';
            button.style.backgroundColor = ''; // Reset background color
            button.style.color = ''; // Reset text color
        }
    });
};

const addToCart = (event) => {
    const button = event.target;
    const title = button.getAttribute('data-title');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Add item to cart
    cartItems.push({ title });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Remove the button from the card
    button.remove();
};

// Check if the add-to-cart button is being initialized correctly
const initializeButtons = () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart); // Make sure this is set correctly
    });
};

// Call the initialization function
initializeButtons();


document.addEventListener('DOMContentLoaded', () => {
    setupCards(); // Set up the cards initially
    updateCardContents(); // Update card contents
    updateAddToCartButtons(); // Update the add to cart buttons based on current cart items
});

// Event Listeners
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('wheel', handleMouseWheel); // Mouse wheel control
// Event Listeners
document.addEventListener('touchstart', handleTouchStart); // Touch start
document.addEventListener('touchmove', handleTouchMove, { passive: false }); // Touch move




