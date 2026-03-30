// Shop v1.8.0 (2026-03-29 17:00 HST): Slide-up Bag Panel & Restored Fireworks.
var currentLang = 'th';
var taxEnabled = false;
var baseFontSize = 1.2;
var shoppingBag = [];

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
        'tax-off': 'ปิด',
        'header-bag': 'กระเป๋าช้อปปิ้ง 🛍️',
        'badge-saved': 'ประหยัดรวม:',
        'item-saved': 'ประหยัดได้'
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
        'tax-off': 'OFF',
        'header-bag': 'Shopping Bag 🛍️',
        'badge-saved': 'Total Saved:',
        'item-saved': 'Saved'
    }
};

function changeFontSize(delta) {
    baseFontSize += delta;
    if (baseFontSize < 0.8) baseFontSize = 0.8;
    if (baseFontSize > 2.5) baseFontSize = 2.5;
    document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'rem');
    localStorage.setItem('shop_font_size', baseFontSize);
    createConfetti();
}

function toggleLanguage() {
    currentLang = (currentLang === 'th') ? 'en' : 'th';
    updateUI();
    renderBag();
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

function toggleBag() {
    var panel = document.getElementById('bag-panel');
    panel.classList.toggle('active');
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

    if (price > 0 && discount > 0) {
        createConfetti();
    }
}

function clearFields() {
    document.getElementById('input-price').value = '';
    document.getElementById('input-discount').value = '';
    var app = document.getElementById('app-container');
    app.classList.add('glow-effect');
    setTimeout(function() { app.classList.remove('glow-effect'); }, 500);
    calculate();
}

function saveDeal() {
    var price = parseFloat(document.getElementById('input-price').value) || 0;
    if (price <= 0) return;

    var savingsText = document.getElementById('display-savings').innerText;
    var totalText = document.getElementById('display-total').innerText;

    shoppingBag.unshift({
        total: totalText,
        saved: savingsText,
        rawSaved: parseFloat(savingsText.replace(/,/g, ''))
    });

    localStorage.setItem('shop_bag', JSON.stringify(shoppingBag));
    createConfetti();
    renderBag();
}

function renderBag() {
    var list = document.getElementById('bag-items-list');
    var totalSavedEl = document.getElementById('total-trip-savings');
    var strings = i18n[currentLang];
    list.innerHTML = "";
    var totalTripSaved = 0;

    shoppingBag.forEach(function(item, index) {
        totalTripSaved += item.rawSaved;
        var div = document.createElement('div');
        div.className = 'bag-item';
        div.innerHTML = '<div class="bag-item-info">' +
                        '<div class="bag-item-total">' + item.total + '</div>' +
                        '<div class="bag-item-saved">' + strings['item-saved'] + ': ' + item.saved + '</div>' +
                        '</div>' +
                        '<button class="del-btn" onclick="removeDeal('+index+')">✕</button>';
        list.appendChild(div);
    });
    totalSavedEl.innerText = totalTripSaved.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function removeDeal(index) {
    shoppingBag.splice(index, 1);
    localStorage.setItem('shop_bag', JSON.stringify(shoppingBag));
    renderBag();
}

function createConfetti() {
    var anchor = document.getElementById('confetti-anchor');
    if(!anchor) return;
    var shapes = ['✨', '🌸', '💖', '⭐', '💎'];
    for (var i = 0; i < 12; i++) {
        var el = document.createElement('div');
        el.className = 'sparkle';
        el.innerText = shapes[Math.floor(Math.random() * shapes.length)];
        el.style.left = '50%'; el.style.top = '50%';
        el.style.fontSize = (Math.random() * 25 + 15) + 'px';
        var tx = (Math.random() - 0.5) * 400;
        var ty = (Math.random() - 0.5) * 400;
        el.style.setProperty('--tx', tx + 'px');
        el.style.setProperty('--ty', ty + 'px');
        anchor.appendChild(el);
        (function(child) { setTimeout(function() { if(child && child.parentNode) anchor.removeChild(child); }, 800); })(el);
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
    var savedBag = localStorage.getItem('shop_bag');
    if (savedBag) shoppingBag = JSON.parse(savedBag);
    updateUI(); calculate(); renderBag();
};
