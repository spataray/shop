// Shop v2.0.0 (2026-04-07 10:15 HST): Added Money Exchange mode with trend graphs.
var currentLang = 'th';
var taxEnabled = false;
var baseFontSize = 1.2;
var currentMode = 'calc'; // 'calc' or 'exchange'
var fromCurrency = 'USD';
var toCurrency = 'THB';
var exchangeRate = 1.0;
var chartInstance = null;

var i18n = {
    'th': {
        'title': 'ส่วนลด',
        'title-exchange': 'แลกเงิน',
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
        'header-math': 'วิธีคำนวณ:',
        'mode-exchange': '💱 แลกเงิน',
        'mode-calc': '🛒 ส่วนลด',
        'label-amount': 'จำนวนเงิน',
        'header-trend': 'แนวโน้มย้อนหลัง',
        'btn-convert': 'คำนวณและอัปเดตเรท'
    },
    'en': {
        'title': 'Discount',
        'title-exchange': 'Exchange',
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
        'header-math': 'How it\'s calculated:',
        'mode-exchange': '💱 Exchange',
        'mode-calc': '🛒 Discount',
        'label-amount': 'Amount',
        'header-trend': 'Historical Trend',
        'btn-convert': 'Calculate & Refresh'
    }
};

function changeFontSize(delta) {
    baseFontSize += delta;
    if (baseFontSize < 0.8) baseFontSize = 0.8;
    if (baseFontSize > 2.5) baseFontSize = 2.5;
    document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'rem');
    localStorage.setItem('shop_font_size', baseFontSize);
    if (currentMode === 'calc') createConfetti();
}

function toggleLanguage() {
    currentLang = (currentLang === 'th') ? 'en' : 'th';
    updateUI();
}

function toggleMode() {
    currentMode = (currentMode === 'calc') ? 'exchange' : 'calc';
    var calcEl = document.getElementById('calc-mode');
    var exchangeEl = document.getElementById('exchange-mode');
    var modeBtn = document.getElementById('mode-toggle');
    var titleEl = document.querySelector('h1');

    if (currentMode === 'calc') {
        calcEl.style.display = 'block';
        exchangeEl.style.display = 'none';
        modeBtn.innerHTML = `<span data-i18n="mode-exchange">${i18n[currentLang]['mode-exchange']}</span>`;
        titleEl.innerText = i18n[currentLang]['title'];
        titleEl.setAttribute('data-i18n', 'title');
    } else {
        calcEl.style.display = 'none';
        exchangeEl.style.display = 'block';
        modeBtn.innerHTML = `<span data-i18n="mode-calc">${i18n[currentLang]['mode-calc']}</span>`;
        titleEl.innerText = i18n[currentLang]['title-exchange'];
        titleEl.setAttribute('data-i18n', 'title-exchange');
        updateExchange();
        updateChart(1);
    }
    updateUI();
}

function toggleTax() {
    taxEnabled = !taxEnabled;
    var btn = document.getElementById('tax-btn');
    var row = document.getElementById('row-tax-amount');
    if (taxEnabled) {
        btn.classList.add('active');
        row.style.display = 'flex';
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
    if (document.getElementById('tax-status-text')) {
        document.getElementById('tax-status-text').innerText = taxEnabled ? strings['tax-on'] : strings['tax-off'];
    }
}

// --- Calculator Mode ---
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

    updateMathBreakdown(price, discount, taxRate, savings, discountedPrice, taxAmount, finalPrice);

    if (price > 0 && discount > 0) {
        createConfetti();
    }
}

function updateMathBreakdown(price, discount, taxRate, savings, discountedPrice, taxAmount, finalPrice) {
    var formulaEl = document.getElementById('math-formula');
    if (price <= 0) {
        formulaEl.innerText = "--";
        return;
    }

    var symbol = (currentLang === 'th') ? '฿' : '$';
    var text = price.toFixed(2) + " " + symbol;
    
    if (discount > 0) {
        text += " - " + discount + "% (" + savings.toFixed(2) + ") = " + discountedPrice.toFixed(2);
    }
    
    if (taxEnabled && taxRate > 0) {
        text += " + " + taxRate + "% (" + taxAmount.toFixed(2) + ") = " + finalPrice.toFixed(2);
    }

    formulaEl.innerText = text + " " + symbol;
}

function clearFields() {
    document.getElementById('input-price').value = '';
    document.getElementById('input-discount').value = '';
    var app = document.getElementById('app-container');
    app.classList.add('glow-effect');
    setTimeout(function() { app.classList.remove('glow-effect'); }, 500);
    calculate();
}

function createConfetti() {
    var anchor = document.getElementById('confetti-anchor');
    if(!anchor) return;
    var shapes = ['✨', '🌸', '💖', '⭐', '💎'];
    for (var i = 0; i < 10; i++) {
        var el = document.createElement('div');
        el.className = 'sparkle';
        el.innerText = shapes[Math.floor(Math.random() * shapes.length)];
        el.style.left = '50%'; el.style.top = '50%';
        el.style.fontSize = (Math.random() * 20 + 10) + 'px';
        var tx = (Math.random() - 0.5) * 350;
        var ty = (Math.random() - 0.5) * 350;
        el.style.setProperty('--tx', tx + 'px');
        el.style.setProperty('--ty', ty + 'px');
        anchor.appendChild(el);
        (function(child) { setTimeout(function() { if(child && child.parentNode) anchor.removeChild(child); }, 800); })(el);
    }
}

// --- Exchange Mode ---
async function updateExchange() {
    const rateEl = document.getElementById('current-rate');
    const resultValEl = document.getElementById('exchange-result-val');
    
    rateEl.innerText = "loading...";
    resultValEl.innerText = "...";

    try {
        const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
        const data = await response.json();
        exchangeRate = data.rates[toCurrency];
        rateEl.innerText = exchangeRate.toFixed(4);
        convertCurrency();
        
        // Add a little "pulse" to show it updated
        const card = document.querySelector('.gold-card');
        card.classList.add('glow-effect');
        setTimeout(() => card.classList.remove('glow-effect'), 500);
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        rateEl.innerText = "Error";
    }
}

function handleExchangeKey(event) {
    if (event.key === "Enter") {
        event.target.blur(); // Hide keyboard on mobile
        convertCurrency();
    }
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('input-exchange-amount').value) || 0;
    const result = amount * exchangeRate;
    
    document.getElementById('exchange-from-text').innerText = `${amount.toLocaleString(undefined, {minimumFractionDigits: 2})} ${fromCurrency}`;
    document.getElementById('exchange-result-val').innerText = result.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('exchange-to-code').innerText = toCurrency;
    
    document.getElementById('base-code').innerText = fromCurrency;
    document.getElementById('target-code').innerText = toCurrency;
}

function swapCurrencies() {
    const temp = fromCurrency;
    fromCurrency = toCurrency;
    toCurrency = temp;
    
    // Update Flags/Codes in UI
    const fromEl = document.getElementById('from-currency');
    const toEl = document.getElementById('to-currency');
    
    const fromFlag = fromCurrency === 'USD' ? '🇺🇸' : '🇹🇭';
    const toFlag = toCurrency === 'USD' ? '🇺🇸' : '🇹🇭';
    
    fromEl.querySelector('.flag').innerText = fromFlag;
    fromEl.querySelector('.code').innerText = fromCurrency;
    toEl.querySelector('.flag').innerText = toFlag;
    toEl.querySelector('.code').innerText = toCurrency;
    
    updateExchange();
    // Re-fetch chart for new currency pair
    const activeTf = document.querySelector('.tf-btn.active').getAttribute('data-tf');
    updateChart(parseInt(activeTf));
}

async function updateChart(months) {
    // Update UI buttons
    document.querySelectorAll('.tf-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tf-btn[data-tf="${months}"]`).classList.add('active');

    const end = new Date(2026, 3, 7); // Fixed "today" for this session: April 7, 2026
    const start = new Date(2026, 3, 7);
    start.setMonth(start.getMonth() - months);
    
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    
    try {
        const response = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${fromCurrency}&to=${toCurrency}`);
        const data = await response.json();
        
        const labels = Object.keys(data.rates);
        const values = labels.map(date => data.rates[date][toCurrency]);
        
        renderChart(labels, values);
    } catch (error) {
        console.error("Error fetching historical data:", error);
    }
}

function renderChart(labels, values) {
    const ctx = document.getElementById('rateChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${fromCurrency} to ${toCurrency}`,
                data: values,
                borderColor: '#C5A028',
                backgroundColor: 'rgba(197, 160, 40, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#1C1C1C',
                    titleColor: '#C5A028',
                    bodyColor: '#FFF',
                    borderColor: '#C5A028',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: { display: false },
                    ticks: {
                        color: '#888',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6
                    }
                },
                y: {
                    display: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { color: '#888' }
                }
            }
        }
    });
}

window.onload = function() {
    var savedTax = localStorage.getItem('shop_tax_rate');
    if (savedTax && document.getElementById('input-tax')) document.getElementById('input-tax').value = savedTax;
    var savedFont = localStorage.getItem('shop_font_size');
    if (savedFont) {
        baseFontSize = parseFloat(savedFont);
        document.documentElement.style.setProperty('--base-font-size', baseFontSize + 'rem');
    }
    updateUI();
    calculate();
};
