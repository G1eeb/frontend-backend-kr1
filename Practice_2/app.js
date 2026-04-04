const express = require('express');
const app = express();
const port = 3000;

// Начальные данные: список товаров
let products = [
    { id: 1, name: 'Ноутбук', price: 45000 },
    { id: 2, name: 'Смартфон', price: 25000 },
    { id: 3, name: 'Наушники', price: 3500 }
];

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Корневой маршрут
app.get('/', (req, res) => {
    res.json({
        message: 'API для управления товарами',
        endpoints: {
            'GET /products': 'Получить все товары',
            'GET /products/:id': 'Получить товар по ID',
            'POST /products': 'Добавить новый товар',
            'PATCH /products/:id': 'Обновить товар',
            'DELETE /products/:id': 'Удалить товар'
        }
    });
});

// GET /products - получить все товары
app.get('/products', (req, res) => {
    res.json(products);
});

// GET /products/:id - получить товар по ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(product);
});

// POST /products - добавить новый товар
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    // Валидация входных данных
    if (!name || price === undefined) {
        return res.status(400).json({ 
            error: 'Необходимо указать название и стоимость товара' 
        });
    }
    
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ 
            error: 'Стоимость должна быть положительным числом' 
        });
    }
    
    // Создание нового товара
    const newProduct = {
        id: Date.now(), // Используем timestamp как уникальный ID
        name: name.trim(),
        price: price
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PATCH /products/:id - обновить товар
app.patch('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    
    // Поиск товара
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Обновление полей
    if (name !== undefined) {
        product.name = name.trim();
    }
    
    if (price !== undefined) {
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ 
                error: 'Стоимость должна быть положительным числом' 
            });
        }
        product.price = price;
    }
    
    res.json(product);
});

// DELETE /products/:id - удалить товар
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    products.splice(productIndex, 1);
    res.json({ message: 'Товар успешно удален' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log('Доступные эндпоинты:');
    console.log('  GET    /products        - получить все товары');
    console.log('  GET    /products/:id    - получить товар по ID');
    console.log('  POST   /products        - добавить товар');
    console.log('  PATCH  /products/:id    - обновить товар');
    console.log('  DELETE /products/:id    - удалить товар');
});