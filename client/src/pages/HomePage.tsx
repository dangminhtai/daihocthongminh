import React, { useState, useEffect, FormEvent } from 'react';

interface Item {
    _id: string;
    name: string;
    description: string;
}

const HomePage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [welcomeMessage, setWelcomeMessage] = useState('');

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/items');
            if (!response.ok) throw new Error('Lỗi khi tải items');
            const data: Item[] = await response.json();
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        }
    };

    const fetchHomeData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/home');
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu home');
            const data = await response.json();
            setWelcomeMessage(data.message);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchHomeData();
            await fetchItems();
            setLoading(false);
        }
        loadData();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });
            if (!response.ok) throw new Error('Không thể tạo item');
            setName('');
            setDescription('');
            fetchItems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi gửi dữ liệu');
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div>
            <h1>Trang Chủ</h1>
            {error && <p className="error">{error}</p>}
            <p style={{ color: 'lime' }}>{welcomeMessage}</p>

            <hr />

            <h2>Thêm Item Mới</h2>
            <form onSubmit={handleSubmit} className="item-form">
                <input
                    type="text"
                    placeholder="Tên item"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Thêm</button>
            </form>

            <h2>Danh sách Items</h2>
            <ul className="item-list">
                {items.map((item) => (
                    <li key={item._id}>
                        <strong>{item.name}:</strong> {item.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;