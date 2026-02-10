// Database Setup
let db;
const request = indexedDB.open("FoodCoDB", 1);

request.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore("finance", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("students", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("menu", { keyPath: "day" });
};

request.onsuccess = (e) => {
    db = e.target.result;
    initApp();
};

// Navigation
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'stats') renderCharts();
}

// Finance Logic
function saveFinance() {
    const transaction = db.transaction(["finance"], "readwrite");
    const store = transaction.objectStore("finance");
    
    const entry = {
        name: document.getElementById('fin-name').value,
        category: document.getElementById('fin-type').value,
        amount: parseFloat(document.getElementById('fin-amount').value),
        method: document.getElementById('fin-method').value,
        date: new Date().toLocaleDateString()
    };

    store.add(entry);
    transaction.oncomplete = () => {
        alert("Transaction Recorded!");
        loadFinanceTable();
    };
}

// Charting Logic (Pro Version)
function renderCharts() {
    const ctx1 = document.getElementById('yearChart').getContext('2d');
    new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['1st Year', '2nd Year', '3rd Year', 'Final Year'],
            datasets: [{
                data: [30, 25, 20, 25], // Dynamic data would come from IndexedDB
                backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b']
            }]
        }
    });

    const ctx2 = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Paid', 'Pending'],
            datasets: [{
                label: 'Amount in ₹',
                data: [12000, 4500],
                backgroundColor: ['#22c55e', '#ef4444']
            }]
        }
    });
}

// Home Dashboard Calculations
function initApp() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    document.getElementById('days-left').innerText = lastDay - today.getDate();
    document.getElementById('next-menu').innerText = "Paneer Butter Masala & Roti";
}
