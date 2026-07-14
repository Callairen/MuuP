// ==========================================
// 1. Inisialisasi Elemen DOM
// ==========================================
const balanceEl = document.getElementById('total-balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const listEl = document.getElementById('history-list');
const formEl = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

// ==========================================
// 2. Persistensi Data (LocalStorage)
// ==========================================
// Mengambil data dari LocalStorage jika ada, jika tidak mulai dengan array kosong
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// ==========================================
// 3. Fungsi Utilitas
// ==========================================

// Formatter Mata Uang Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Generate ID Unik (Simple Random Math)
const generateID = () => {
    return Math.floor(Math.random() * 100000000);
};

// ==========================================
// 4. Logika Render & Perhitungan
// ==========================================

// Render Transaksi ke dalam DOM HTML
const addTransactionDOM = (transaction) => {
    // Menentukan warna dan tanda berdasarkan tipe transaksi
    const isIncome = transaction.type === 'income';
    const bgColor = isIncome ? 'bg-kawaii-income' : 'bg-kawaii-expense';
    const textColor = isIncome ? 'text-emerald-700' : 'text-rose-700';
    const sign = isIncome ? '+' : '-';

    // Membuat elemen List (<li>)
    const item = document.createElement('li');
    item.classList.add(bgColor, textColor, 'rounded-2xl', 'p-4', 'flex', 'justify-between', 'items-center', 'shadow-sm', 'transition-all', 'hover:scale-[1.02]');

    // Menyuntikkan HTML ke dalam tag <li> menggunakan Template Literals
    item.innerHTML = `
        <span class="font-semibold">${transaction.text}</span>
        <div class="flex items-center gap-4">
            <span class="font-bold">${sign} ${formatRupiah(Math.abs(transaction.amount))}</span>
            <button onclick="removeTransaction(${transaction.id})" class="text-slate-400 hover:text-slate-600 bg-white/50 px-2 py-1 rounded-lg text-sm font-bold transition-colors shadow-sm">
                X
            </button>
        </div>
    `;

    // Menambahkan elemen ke dalam daftar riwayat di HTML
    listEl.appendChild(item);
};

// Kalkulasi dan Update Kartu Saldo (Header)
const updateValues = () => {
    // Menghitung total pemasukan
    const incomeTotal = transactions
        .filter(item => item.type === 'income')
        .reduce((acc, item) => acc + item.amount, 0);

    // Menghitung total pengeluaran
    const expenseTotal = transactions
        .filter(item => item.type === 'expense')
        .reduce((acc, item) => acc + item.amount, 0);

    // Saldo akhir
    const balanceTotal = incomeTotal - expenseTotal;

    // Menampilkan hasil ke antarmuka
    balanceEl.innerText = formatRupiah(balanceTotal);
    incomeEl.innerText = formatRupiah(incomeTotal);
    expenseEl.innerText = formatRupiah(expenseTotal);
};

// ==========================================
// 5. Aksi Pengguna & Pembaruan Sistem
// ==========================================

// Hapus Transaksi berdasarkan ID
window.removeTransaction = (id) => {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init(); // Render ulang setelah dihapus
};

// Update LocalStorage dengan array transaksi terbaru
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
};

// Event Listener: Form Submit (Menambahkan Transaksi Baru)
formEl.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah reload halaman bawaan browser

    // Validasi input
    if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Ups! Mohon isi nama transaksi dan nominalnya ya. 🌸');
        return;
    }

    // Membuat objek transaksi baru
    const transaction = {
        id: generateID(),
        text: textInput.value,
        amount: +amountInput.value, // Tanda plus (+) mengubah string menjadi number
        type: typeInput.value
    };

    // Memasukkan ke array, render ke layar, dan simpan
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Reset input form setelah berhasil
    textInput.value = '';
    amountInput.value = '';
});

// ==========================================
// 6. Siklus Hidup Aplikasi (Lifecycle)
// ==========================================

// Fungsi Inisialisasi Aplikasi saat pertama dimuat
const init = () => {
    listEl.innerHTML = ''; // Bersihkan kontainer list sebelum dirender
    transactions.forEach(addTransactionDOM); // Looping data dari localstorage
    updateValues(); // Hitung ulang saldo
};

// Jalankan aplikasi
init();