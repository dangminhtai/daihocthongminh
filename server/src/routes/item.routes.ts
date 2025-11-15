import express, { Request, Response, Router } from 'express';
import Item from '../models/item.model';

const router = Router();

// API 1: Lấy tất cả items
router.get('/', async (req: Request, res: Response) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error });
    }
});

// API 2: Tạo một item mới
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: 'Tên và mô tả là bắt buộc' });
        }
        const newItem = new Item({ name, description });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo item', error });
    }
});

export default router;