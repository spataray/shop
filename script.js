var currentLang = 'th';

var i18n = {
    'th': {
        'title': 'เครื่องคิดเลขส่วนลด',
        'label-price': 'ราคาปกติ',
        'label-discount': 'ส่วนลด (%)',
        'label-tax': 'ภาษี (%)',
        'res-savings': 'ประหยัดไป',
        'res-total': 'ราคาสุดท้าย',
        'btn-clear': 'ล้างข้อมูล',
        'toggle-btn': 'English',
        'currency': '฿'
    },
    'en': {
        'title': 'Discount Calculator',
        'label-price': 'Original Price',
        'label-discount': 'Discount (%)',
        'label-tax': 'Tax (%)',
        'res-savings': 'You Save',
        'res-total': 'Final Price',
        'btn-clear': 'Clear All',
        'toggle-btn': 'ไทย',
        'currency': '$'
    }
};

function toggleLanguage() {
    currentLang = (currentLang === 'th') ? 'en' : 'th';
    updateUI();
}

function updateUI() {
    var strings = i18n[currentLang];
    
    // Update labels
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-i18n');
        if (strings[key]) {
            elements[i].innerText = strings[key];
        }
    }

    // Update currency spans
    var currencySpans = document.querySelectorAll('.currency');
    for (var j = 0; j < currencySpans.length; j++) {
        currencySpans[j].innerText = strings['currency'];
    }

    // Update button text
    document.getElementById('btn-lang').innerText = strings['toggle-btn'];

    // Re-calculate to update result strings
    calculate();
}

function calculate() {
    var price = parseFloat(document.getElementById('input-price').value) || 0;
    var discount = parseFloat(document.getElementById('input-discount').value) || 0;
    var taxEnabled = document.getElementById('tax-enable').checked;
    var taxRate = parseFloat(document.getElementById('input-tax').value) || 0;

    // Save tax rate preference
    localStorage.setItem('shop_tax_rate', taxRate);

    // 1. Calculate discount
    var savings = price * (discount / 100);
    var discountedPrice = price - savings;

    // 2. Calculate tax
    var finalPrice = discountedPrice;
    if (taxEnabled) {
        finalPrice = discountedPrice * (1 + (taxRate / 100));
    }

    // 3. Display results
    var strings = i18n[currentLang];
    document.getElementById('display-savings').innerText = savings.toFixed(2) + ' ' + strings['currency'];
    document.getElementById('display-total').innerText = finalPrice.toFixed(2) + ' ' + strings['currency'];
}

function clearFields() {
    document.getElementById('input-price').value = '';
    document.getElementById('input-discount').value = '';
    document.getElementById('tax-enable').checked = false;
    calculate();
}

// Initialize
window.onload = function() {
    var savedTax = localStorage.getItem('shop_tax_rate');
    if (savedTax) {
        document.getElementById('input-tax').value = savedTax;
    }
    updateUI(); // Set default Thai
};
