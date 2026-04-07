const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3001", methods: ["GET", "POST", "PATCH", "DELETE"] }));

// Начальные данные: 10+ товаров (геймерские девайсы)
let products = [
    { id: 1, name: 'Игровая мышь Logitech G502', category: 'Мыши', description: 'Высокоточная мышь с 11 программируемыми кнопками и подсветкой RGB', price: 4990, stock: 15, rating: 4.8 },
    { id: 2, name: 'Механическая клавиатура HyperX Alloy', category: 'Клавиатуры', description: 'Механические переключатели Red, RGB подсветка, металлический корпус', price: 8990, stock: 8, rating: 4.9 },
    { id: 3, name: 'Игровая гарнитура Razer Kraken', category: 'Аудио', description: 'Объёмный звук 7.1, шумоподавляющий микрофон', price: 6990, stock: 12, rating: 4.7 },
    { id: 4, name: 'Монитор ASUS ROG 27"', category: 'Мониторы', description: '165Hz, 1ms, G-Sync, IPS матрица', price: 29990, stock: 5, rating: 4.9 },
    { id: 5, name: 'Игровой коврик SteelSeries QcK', category: 'Аксессуары', description: 'Большой коврик с прошитыми краями', price: 1990, stock: 20, rating: 4.5 },
    { id: 6, name: 'Видеокарта RTX 4070', category: 'Комплектующие', description: '12GB GDDR6X, поддержка DLSS 3', price: 65990, stock: 3, rating: 5.0 },
    { id: 7, name: 'Процессор AMD Ryzen 7 7800X3D', category: 'Комплектующие', description: '8 ядер, 16 потоков, 3D V-Cache', price: 38990, stock: 7, rating: 4.9 },
    { id: 8, name: 'Игровое кресло Cougar Armor', category: 'Кресла', description: 'Эргономичное, с поясничной поддержкой', price: 24990, stock: 4, rating: 4.6 },
    { id: 9, name: 'Стрим-дек Elgato Stream Deck', category: 'Стриминг', description: '15 программируемых LCD-кнопок', price: 12990, stock: 6, rating: 4.8 },
    { id: 10, name: 'USB микрофон HyperX QuadCast', category: 'Аудио', description: 'Конденсаторный, с антивибрационной подвеской', price: 11990, stock: 9, rating: 4.7 },
    { id: 11, name: 'Сетевая карта TP-Link Gaming', category: 'Аксессуары', description: '2.5 Гбит/с, приоритет трафика', price: 3490, stock: 11, rating: 4.4 },
    { id: 12, name: 'Игровой контроллер Xbox', category: 'Контроллеры', description: 'Беспроводной, совместим с ПК', price: 4990, stock: 14, rating: 4.8 }
];

// Middleware для логирования
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// GET /products - все товары
app.get('/products', (req, res) => {
    res.json(products);
});

// GET /products/:id - товар по ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
});

// POST /products - добавить товар
app.post('/products', (req, res) => {
    const { name, category, description, price, stock, rating } = req.body;
    
    if (!name || !category || !description || price === undefined || stock === undefined) {
        return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }
    
    const newProduct = {
        id: Date.now(),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        rating: rating || 0
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PATCH /products/:id - обновить товар
app.patch('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const { name, category, description, price, stock, rating } = req.body;
    
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    
    res.json(product);
});

// DELETE /products/:id - удалить товар
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    products.splice(index, 1);
    res.json({ message: 'Товар удалён' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});