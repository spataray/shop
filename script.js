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
        'res-tax-amt': 'ภาษีเพิ่มเติม',
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
        'res-tax-amt': 'Tax Added',
        'res-total': 'Final Total',
        'btn-clear': 'Clear All',
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
    createConfetti(); // Little sparkle for resizing
}

function toggleLanguage() {
    currentLang = (currentLang === 'th') ? 'en' : 'th';
    updateUI();
    createConfetti();
}

function toggleTax() {
    taxEnabled = !taxEnabled;
    var btn = document.getElementById('tax-btn');
    var row = document.getElementById('row-tax-amount');
    if (taxEnabled) {
        btn.classList.add('active');
        row.style.display = 'flex';
        createConfetti();
    } else {
        btn.classList.remove('active');
        row.style.display = 'none';
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
    var taxAmount = 0;
    var finalPrice = discountedPrice;
    
    if (taxEnabled) {
        taxAmount = discountedPrice * (taxRate / 100);
        finalPrice = discountedPrice + taxAmount;
    }

    document.getElementById('display-savings').innerText = savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('display-tax-amount').innerText = '+' + taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('display-total').innerText = finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    // Magic Splash Effect on Total
    if (price > 0 && discount > 0) {
        createConfetti();
    }
}

function clearFields() {
    document.getElementById('input-price').value = '';
    document.getElementById('input-discount').value = '';
    
    // Glimmer Effect
    var app = document.getElementById('app-container');
    app.classList.add('glow-effect');
    setTimeout(function() { app.classList.remove('glow-effect'); }, 500);
    
    calculate();
}

function createConfetti() {
    var anchor = document.getElementById('confetti-anchor');
    var colors = ['#D4AF37', '#E0A9AF', '#FCE4EC', '#FFF', '#B76E79'];
    var shapes = ['✨', '🌸', '💖', '⭐', '💎'];

    for (var i = 0; i < 8; i++) {
        var el = document.createElement('div');
        el.className = 'sparkle';
        el.innerText = shapes[Math.floor(Math.random() * shapes.length)];
        el.style.left = '50%';
        el.style.top = '50%';
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
        el.style.fontSize = (Math.random() * 20 + 10) + 'px';
        
        // Random trajectory
        var tx = (Math.random() - 0.5) * 300;
        var ty = (Math.random() - 0.5) * 300;
        el.style.setProperty('--tx', tx + 'px');
        el.style.setProperty('--ty', ty + 'px');
        
        anchor.appendChild(el);
        
        // Cleanup
        (function(child) {
            setTimeout(function() { anchor.removeChild(child); }, 800);
        })(el);
    }
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
