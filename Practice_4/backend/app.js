const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3001", methods: ["GET", "POST", "PATCH", "DELETE"] }));

// Начальные данные: 12 товаров (геймерские девайсы)
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

// ==================== SWAGGER КОНФИГУРАЦИЯ ====================

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API интернет-магазина GAMER GEAR',
            version: '1.0.0',
            description: 'API для управления товарами в магазине геймерских девайсов',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==================== SWAGGER СХЕМЫ ====================

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор товара
 *           example: 1
 *         name:
 *           type: string
 *           description: Название товара
 *           example: "Игровая мышь Logitech G502"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Мыши"
 *         description:
 *           type: string
 *           description: Описание товара
 *           example: "Высокоточная мышь с 11 программируемыми кнопками"
 *         price:
 *           type: number
 *           description: Цена в рублях
 *           example: 4990
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *           example: 15
 *         rating:
 *           type: number
 *           description: Рейтинг товара (0-5)
 *           example: 4.8
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Сообщение об ошибке
 */

// ==================== CRUD ОПЕРАЦИИ ====================

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Успешный ответ со списком товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/products', (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(product);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Новая игровая мышь"
 *               category:
 *                 type: string
 *                 example: "Мыши"
 *               description:
 *                 type: string
 *                 example: "Описание нового товара"
 *               price:
 *                 type: number
 *                 example: 5990
 *               stock:
 *                 type: integer
 *                 example: 10
 *               rating:
 *                 type: number
 *                 example: 4.5
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Частично обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Обновлённое название"
 *               category:
 *                 type: string
 *                 example: "Новая категория"
 *               description:
 *                 type: string
 *                 example: "Обновлённое описание"
 *               price:
 *                 type: number
 *                 example: 6990
 *               stock:
 *                 type: integer
 *                 example: 20
 *               rating:
 *                 type: number
 *                 example: 4.9
 *     responses:
 *       200:
 *         description: Товар успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нечего обновлять
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.patch('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const { name, category, description, price, stock, rating } = req.body;
    
    if (name === undefined && category === undefined && description === undefined && price === undefined && stock === undefined && rating === undefined) {
        return res.status(400).json({ error: 'Нечего обновлять' });
    }
    
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    
    res.json(product);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Товар успешно удалён"
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    products.splice(index, 1);
    res.json({ message: 'Товар успешно удалён' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger документация доступна на http://localhost:${port}/api-docs`);
});