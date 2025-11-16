// CAD Store JavaScript
let cart = [];
let cartCount = 0;

// Update cart count display
function updateCartCount() {
    document.getElementById('cart-count').textContent = cartCount;
}

// Add item to cart
function addToCart(productName, software, price) {
    cart.push({
        name: productName,
        software: software,
        price: parseFloat(price),
        quantity: 1
    });
    cartCount++;
    updateCartCount();

    // Show notification
    showNotification(`${productName} added to cart!`, 'success');

    console.log('Cart updated:', cart);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Filter products
function filterProducts(filter) {
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        if (filter === 'all' || product.dataset.software === filter) {
            product.classList.remove('hidden');
            product.style.animation = 'fadeInUp 0.6s ease-out forwards';
        } else {
            product.classList.add('hidden');
        }
    });
}

// Search products
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const lowerQuery = query.toLowerCase();

    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const software = product.dataset.software.toLowerCase();

        if (title.includes(lowerQuery) || software.includes(lowerQuery)) {
            product.classList.remove('hidden');
        } else {
            product.classList.add('hidden');
        }
    });
}

// Modal functionality
let currentPreviewData = null;

function openPreviewModal(filePath, productName, software, price) {
    const modal = document.getElementById('previewModal');
    const fileName = filePath.split('/').pop();

    document.getElementById('previewFileName').textContent = productName;
    document.getElementById('previewSoftware').textContent = software.toUpperCase();
    document.getElementById('previewPrice').textContent = `$${price}`;
    document.getElementById('filePath').textContent = filePath;

    currentPreviewData = { filePath, productName, software, price };

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentPreviewData = null;
}

// Smooth scrolling for navigation
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart button event listeners
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const productName = card.querySelector('h3').textContent;
            const software = card.dataset.software;
            const price = card.dataset.price;

            addToCart(productName, software, price);
        });
    });

    // Filter button event listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.dataset.filter;
            filterProducts(filter);
        });
    });

    // Search input event listener
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length > 0) {
            searchProducts(query);
        } else {
            filterProducts('all');
        }
    });

    // Preview button event listeners
    const previewButtons = document.querySelectorAll('.preview-btn');
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filePath = this.dataset.file;
            const card = this.closest('.product-card');
            const productName = card.querySelector('h3').textContent;
            const software = card.dataset.software;
            const price = card.dataset.price;

            openPreviewModal(filePath, productName, software, price);
        });
    });

    // Navigation link event listeners
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });

    // Modal event listeners
    const modal = document.getElementById('previewModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', closePreviewModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closePreviewModal();
        }
    });

    // Modal action buttons
    const downloadBtn = document.querySelector('.download-btn');
    const addToCartModalBtn = document.querySelector('.add-to-cart-modal');

    downloadBtn.addEventListener('click', function() {
        if (currentPreviewData) {
            showNotification('Download started! Check your downloads folder.', 'success');
            // In a real application, this would trigger a file download
            console.log('Downloading:', currentPreviewData.filePath);
        }
    });

    addToCartModalBtn.addEventListener('click', function() {
        if (currentPreviewData) {
            addToCart(currentPreviewData.productName, currentPreviewData.software, currentPreviewData.price);
            closePreviewModal();
        }
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.category-card, .stat');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Welcome message
    setTimeout(() => {
        showNotification('Welcome to CAD Store! Browse our professional CAD projects.', 'info');
    }, 1000);

    console.log('CAD Store initialized successfully!');
});
