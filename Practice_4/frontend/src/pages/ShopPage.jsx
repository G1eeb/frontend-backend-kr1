import React, { useState, useEffect } from "react";
import { api } from "../api";
import "./ShopPage.scss";

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
            alert("Ошибка загрузки товаров");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить товар?")) return;
        try {
            await api.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert("Ошибка удаления");
        }
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleSubmit = async (productData) => {
        try {
            if (editingProduct) {
                const updated = await api.updateProduct(editingProduct.id, productData);
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
            } else {
                const created = await api.createProduct(productData);
                setProducts(prev => [...prev, created]);
            }
            setModalOpen(false);
        } catch (err) {
            alert("Ошибка сохранения");
        }
    };

    return (
        <div className="shop">
            <header className="header">
                <div className="header__inner">
                    <div className="logo">🎮 GAMER GEAR</div>
                    <button className="btn btn--primary" onClick={openCreateModal}>
                        + Добавить товар
                    </button>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <h1 className="title">Игровые девайсы</h1>
                    {loading ? (
                        <div className="loading">Загрузка...</div>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-card__content">
                                        <div className="product-category">{product.category}</div>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-price">{product.price.toLocaleString()} ₽</div>
                                        <div className="product-stock">
                                            {product.stock > 0 ? `✅ В наличии: ${product.stock} шт` : "❌ Нет в наличии"}
                                        </div>
                                        <div className="product-rating">⭐ {product.rating || "—"}</div>
                                    </div>
                                    <div className="product-card__actions">
                                        <button className="btn" onClick={() => openEditModal(product)}>
                                            ✏️ Редактировать
                                        </button>
                                        <button className="btn btn--danger" onClick={() => handleDelete(product.id)}>
                                            🗑️ Удалить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">
                    © 2026 GAMER GEAR — Магазин геймерских девайсов
                </div>
            </footer>

            {modalOpen && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}

// Компонент модального окна
function ProductModal({ product, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: product?.name || "",
        category: product?.category || "",
        description: product?.description || "",
        price: product?.price || "",
        stock: product?.stock || "",
        rating: product?.rating || ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <h2>{product ? "Редактировать товар" : "Добавить товар"}</h2>
                    <button className="close-btn" onClick={onClose}>✖</button>
                </div>
                <form className="modal__form" onSubmit={handleSubmit}>
                    <input name="name" placeholder="Название" value={formData.name} onChange={handleChange} required />
                    <input name="category" placeholder="Категория" value={formData.category} onChange={handleChange} required />
                    <textarea name="description" placeholder="Описание" value={formData.description} onChange={handleChange} required />
                    <input name="price" type="number" placeholder="Цена (₽)" value={formData.price} onChange={handleChange} required />
                    <input name="stock" type="number" placeholder="Количество на складе" value={formData.stock} onChange={handleChange} required />
                    <input name="rating" type="number" step="0.1" placeholder="Рейтинг (0-5)" value={formData.rating} onChange={handleChange} />
                    <button type="submit" className="btn btn--primary">{product ? "Сохранить" : "Создать"}</button>
                </form>
            </div>
        </div>
    );
}