var currentLang = 'th';
var taxEnabled = false;
var baseFontSize = 1.2;

var i18n = {
    'th': {
        'title': 'ส่วนลด',
        'label-price': 'ราคาปกติ',
        'label-discount': 'ส่วนลด (%)',
        'label-tax': 'ภาษี (%)',
        'res-savings': 'ประหยัดไป',
        'res-total': 'ราคาสุดท้าย',
        'btn-clear': 'ล้างข้อมูล',
        'toggle-btn': 'English',
        'tax-on': 'เปิด',
        'tax-off': 'ปิด'
    },
    'en': {
        'title': 'Discount',
        'label-price': 'Price',
        'label-discount': 'Discount (%)',
        'label-tax': 'Tax (%)',
        'res-savings': 'Savings',
        'res-total': 'Final Total',
        'btn-clear': 'Clear',
        'toggle-btn': 'ไทย',
        'tax-on': 'ON',
        'tax-off': 'OFF'
    }
};

function changeFontSize(delta) {
    baseFontSize += delta;
    if (baseFontSize < 0.8) baseFontSize = 0.8;
    if (baseFontSize > 2.5) baseFontSize = 2.5;
    document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'rem');
    localStorage.setItem('shop_font_size', baseFontSize);
}

function toggleLanguage() {
    currentLang = (currentLang === 'th') ? 'en' : 'th';
    updateUI();
}

function toggleTax() {
    taxEnabled = !taxEnabled;
    var btn = document.getElementById('tax-btn');
    if (taxEnabled) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
    updateUI();
    calculate();
}

function updateUI() {
    var strings = i18n[currentLang];
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-i18n');
        if (strings[key]) elements[i].innerText = strings[key];
    }
    document.getElementById('btn-lang').innerText = strings['toggle-btn'];
    document.getElementById('tax-status-text').innerText = taxEnabled ? strings['tax-on'] : strings['tax-off'];
}

function calculate() {
    var price = parseFloat(document.getElementById('input-price').value) || 0;
    var discount = parseFloat(document.getElementById('input-discount').value) || 0;
    var taxRate = parseFloat(document.getElementById('input-tax').value) || 0;

    localStorage.setItem('shop_tax_rate', taxRate);

    var savings = price * (discount / 100);
    var discountedPrice = price - savings;
    var finalPrice = discountedPrice;
    
    if (taxEnabled) {
        finalPrice = discountedPrice * (1 + (taxRate / 100));
    }

    document.getElementById('display-savings').innerText = savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('display-total').innerText = finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function clearFields() {
    document.getElementById('input-price').value = '';
    document.getElementById('input-discount').value = '';
    calculate();
}

window.onload = function() {
    var savedTax = localStorage.getItem('shop_tax_rate');
    if (savedTax) document.getElementById('input-tax').value = savedTax;
    
    var savedFont = localStorage.getItem('shop_font_size');
    if (savedFont) {
        baseFontSize = parseFloat(savedFont);
        document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'rem');
    }
    
    updateUI();
    calculate();
};
