/* Лабораторна робота №5. Варіант n = 66. */
const VARIANT = 66;

/* =========================================================
   Завдання 1. Форма з перевіркою регулярними виразами.
   Таблиця 1 має 15 рядків: (66 − 1) mod 15 + 1 = 6 → рядки 1, 7, 8, 9, 10
   таблиці 2: ПІБ, Дата народж., Адреса, e-mail, Telegram.
   ========================================================= */
const RULES = [
    {
        id: 'fio', title: 'ПІБ',
        // ТТТТТТ Т.Т.  — прізвище та два ініціали
        re: /^[А-ЯІЇЄҐ][а-яіїєґ'’-]+ [А-ЯІЇЄҐ]\.[А-ЯІЇЄҐ]\.$/,
        error: 'Формат: Прізвище І.Б. (напр., Брітіков О.Д.)'
    },
    {
        id: 'birth', title: 'Дата народж.',
        // ЧЧ.ЧЧ.ЧЧЧЧ
        re: /^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/,
        error: 'Формат: ДД.ММ.РРРР (напр., 29.05.2007)',
        extra: isRealDate
    },
    {
        id: 'address', title: 'Адреса',
        // м. ЧЧЧЧЧЧ
        re: /^м\. \d{6}$/,
        error: 'Формат: м. та 6 цифр (напр., м. 123456)'
    },
    {
        id: 'email', title: 'e-mail',
        // тттттт@ттттт.com
        re: /^[A-Za-z][A-Za-z0-9._]*@[A-Za-z]+\.com$/,
        error: 'Формат: текст@текст.com (напр., name@mail.com)'
    },
    {
        id: 'telegram', title: 'Telegram',
        // @Т_ТТТТТ
        re: /^@[A-Za-z][A-Za-z0-9_]{4,31}$/,
        error: 'Формат: @ та 5–32 символи (літери, цифри, _)'
    }
];

// перевірка, що дата існує в календарі (наприклад, 31.02 — помилка)
function isRealDate(value) {
    const [d, m, y] = value.split('.').map(Number);
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    let allValid = true;

    RULES.forEach(function (rule) {
        const input = document.getElementById(rule.id);
        const msg = input.parentElement.querySelector('.msg');
        const value = input.value.trim();
        const ok = rule.re.test(value) && (!rule.extra || rule.extra(value));

        input.classList.toggle('valid', ok);
        input.classList.toggle('invalid', !ok);
        msg.textContent = ok ? '' : rule.error;
        if (!ok) allValid = false;
    });

    if (allValid) {
        showResult();
    } else {
        result.hidden = true;   // є помилки — рядки з помилками виділено
    }
});

// вивід введених даних в окремому блоці
function showResult() {
    result.innerHTML = '';
    const title = document.createElement('h3');
    title.textContent = 'Введені дані';
    result.appendChild(title);

    RULES.forEach(function (rule) {
        const p = document.createElement('p');
        const b = document.createElement('b');
        b.textContent = rule.title + ': ';
        p.appendChild(b);
        p.appendChild(document.createTextNode(document.getElementById(rule.id).value.trim()));
        result.appendChild(p);
    });
    result.hidden = false;
}

/* =========================================================
   Завдання 2. Таблиця 6×6.
   Комірка = (66 − 1) mod 10 + 1 = 6.
   mouseover — випадковий колір, click — колір з палітри,
   dblclick — прямокутник від обраної комірки до правого нижнього кута таблиці.
   ========================================================= */
const SIZE = 6;
const CELL_NUMBER = ((VARIANT - 1) % 10) + 1;   // 6

const grid = document.getElementById('grid');
const palette = document.getElementById('palette');

for (let r = 0; r < SIZE; r++) {
    const tr = grid.insertRow();
    for (let c = 0; c < SIZE; c++) {
        const td = tr.insertCell();
        td.textContent = r * SIZE + c + 1;
    }
}

const cellAt = (r, c) => grid.rows[r].cells[c];
const target = cellAt(Math.floor((CELL_NUMBER - 1) / SIZE), (CELL_NUMBER - 1) % SIZE);
const targetRow = target.parentElement.rowIndex;
const targetCol = target.cellIndex;
target.classList.add('active');

function randomColor() {
    const n = Math.floor(Math.random() * 0xffffff);
    return '#' + n.toString(16).padStart(6, '0');
}

// наведення — випадковий колір
target.addEventListener('mouseover', function () {
    target.style.backgroundColor = randomColor();
});

// клік — колір з палітри
target.addEventListener('click', function () {
    target.style.backgroundColor = palette.value;
});

// подвійний клік — усі клітинки прямокутника, що починається з обраної
target.addEventListener('dblclick', function () {
    for (let r = targetRow; r < SIZE; r++) {
        for (let c = targetCol; c < SIZE; c++) {
            cellAt(r, c).style.backgroundColor = palette.value;
        }
    }
});

document.getElementById('reset').addEventListener('click', function () {
    for (const td of grid.querySelectorAll('td')) td.style.backgroundColor = '';
});
