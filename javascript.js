/* =====================================================
   BEAN BOUTIQUE — Main JavaScript
   ===================================================== */

/* #region 1. Page Initialization */
document.addEventListener('DOMContentLoaded', function () {
    handleFirstVisitModal();
    updateCartCount();

    // Load cart page if we're on it
    if (document.getElementById('cartItems')) {
        loadCart();
    }
});
/* #endregion */

/* #region 2. Mobile Nav Toggle */
function toggleMenu() {
    var menu = document.getElementById('navMenu');
    if (menu) {
        menu.classList.toggle('open');
    }
}
/* #endregion */

/* #region 3. First-Visit Discount Modal */
function handleFirstVisitModal() {
    var modalEl = document.getElementById('discountModal');
    if (!modalEl) return; // Modal only exists on the homepage

    if (!document.cookie.includes('visited=true')) {
        var modal = new bootstrap.Modal(modalEl);
        modal.show();
        document.cookie = 'visited=true; max-age=86400; path=/';
    }
}
/* #endregion */

/* #region 4. Coffee Search & Filter */
function filterCoffees() {
    var input = document.getElementById('coffeeSearch');
    if (!input) return;

    var filter = input.value.toLowerCase();
    var cards = document.getElementsByClassName('coffee-card');
    var noResults = document.getElementById('noResults');
    var visibleCount = 0;

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var name = card.querySelector('h3').textContent.toLowerCase();
        var notesEl = card.querySelector('.tasting-notes');
        var notes = notesEl ? notesEl.textContent.toLowerCase() : '';

        if (name.indexOf(filter) !== -1 || notes.indexOf(filter) !== -1) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    }

    if (noResults) {
        noResults.classList.toggle('show', visibleCount === 0);
    }
}

function clearSearch() {
    var input = document.getElementById('coffeeSearch');
    if (input) {
        input.value = '';
        filterCoffees();
    }
}

function filterByRoast(roast) {
    var cards = document.getElementsByClassName('coffee-card');
    var buttons = document.getElementsByClassName('filter-btn');
    var noResults = document.getElementById('noResults');
    var visibleCount = 0;

    // Update active button
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        if (buttons[i].getAttribute('data-filter') === roast) {
            buttons[i].classList.add('active');
        }
    }

    // Filter cards
    for (var j = 0; j < cards.length; j++) {
        var card = cards[j];
        var cardRoast = card.getAttribute('data-roast');
        if (roast === 'all' || cardRoast === roast) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    }

    if (noResults) {
        noResults.classList.toggle('show', visibleCount === 0);
    }
}
/* #endregion */

/* #region 5. Shopping Cart */
function addToCart(name, price) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var existingItem = cart.find(function (item) { return item.name === name; });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added ' + name + ' to your cart!\nKSH ' + price.toLocaleString());
    updateCartCount();
}

function addBundleToCart() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var bundleItem = cart.find(function (item) { return item.name === 'Starter Kit Bundle'; });

    if (bundleItem) {
        bundleItem.quantity += 1;
    } else {
        cart.push({ name: 'Starter Kit Bundle', price: 6000, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Starter Kit added to your cart!\n\nIncludes:\n• 250g bag of coffee\n• AeroPress\n\nTotal: KSH 6,000 (Save KSH 1,200)');
    updateCartCount();
}

function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var count = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    var badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
    }
}

function loadCart() {
    var cartItems = document.getElementById('cartItems');
    var cartTotal = document.getElementById('cartTotal');
    if (!cartItems) return;

    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<div class="cart-empty">' +
                '<i class="fas fa-shopping-cart"></i>' +
                '<h3>Your cart is empty</h3>' +
                '<p>Add some coffee or equipment to get started.</p>' +
                '<a href="coffeeselection.html">Browse Coffees</a>' +
            '</div>';
        if (cartTotal) cartTotal.textContent = 'KSH 0';
        return;
    }

    var html = '';
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var subtotal = item.price * item.quantity;
        total += subtotal;

        html +=
            '<div class="cart-item">' +
                '<span class="item-name">' + item.name + '</span>' +
                '<span class="item-price">KSH ' + item.price.toLocaleString() + ' × ' + item.quantity + '</span>' +
                '<span class="item-subtotal">KSH ' + subtotal.toLocaleString() + '</span>' +
                '<button class="remove-btn" onclick="removeFromCart(' + i + ')" aria-label="Remove item">' +
                    '<i class="fas fa-times"></i>' +
                '</button>' +
            '</div>';
    }

    cartItems.innerHTML = html;
    if (cartTotal) {
        cartTotal.textContent = 'KSH ' + total.toLocaleString();
    }
}

function removeFromCart(index) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function clearCart() {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    localStorage.removeItem('cart');
    loadCart();
    updateCartCount();
}

function checkout() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    var total = cart.reduce(function (sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    alert(
        'Order Confirmed!\n\n' +
        'Items: ' + cart.length + '\n' +
        'Total: KSH ' + total.toLocaleString() + '\n\n' +
        'Thank you for shopping with Bean Boutique.'
    );

    localStorage.removeItem('cart');
    loadCart();
    updateCartCount();
}
/* #endregion */

/* #region 6. Subscription Plans */
function subscribe(plan) {
    alert(
        'Thank you for subscribing!\n\n' +
        'Plan: ' + plan + '\n\n' +
        'You\'ll receive a confirmation email with delivery details shortly.'
    );
}
/* #endregion */

/* #region 7. Events Registration */
function submitRegistration(event) {
    event.preventDefault();

    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var email = document.getElementById('email').value.trim();
    var eventSelect = document.getElementById('eventSelect');
    var eventName = eventSelect.options[eventSelect.selectedIndex].text;

    // Confirmation message
    alert(
        'Registration Confirmed!\n\n' +
        'Name: ' + firstName + ' ' + lastName + '\n' +
        'Email: ' + email + '\n' +
        'Event: ' + eventName + '\n\n' +
        'We\'ll send a confirmation email shortly.'
    );

    // Reset the form
    document.getElementById('registrationForm').reset();
    return false;
}
/* #endregion */