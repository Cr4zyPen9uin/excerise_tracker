// HomePage.tsx
import { useCallback, useState, useEffect } from '@lynx-js/react';
import './HomePage.css';
import { localStorage } from './storage';

interface ItemData {
    id: string; // Unique ID for each item
    title: string;
    description: string;
    quantity: number;
    date?: string;
    itemType: string;
}

const itemTypes = ['Type A', 'Type B', 'Type C', 'Type D'];

export function HomePage() {
    const [items, setItems] = useState<ItemData[]>(() => {
        const savedItemsPromise = localStorage.getItem('items');
        return savedItemsPromise
        .then((savedItems) => {
            return savedItems ? JSON.parse(savedItems) : [];
        })
        .catch((error) => {
            console.error('Error parsing items from storage:', error);
            return [];
        });
    });
    const [showForm, setShowForm] = useState<boolean>(false);
    const [newItem, setNewItem] = useState<ItemData>({
        id: '', // Initialize with an empty ID
        title: '',
        description: '',
        quantity: 0,
        date: '',
        itemType: itemTypes[0]
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [editItemId, setEditItemId] = useState<string | null>(null); // Track the ID of the item being edited

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items))
        .catch((error) => {
            console.error('Error saving items to storage:', error);
        });
    }, [items]);

    const addItem = useCallback(() => {
        setShowForm(true);
        setEditItemId(null); // Reset edit mode when adding a new item
        setNewItem({ id: '', title: '', description: '', quantity: 0, date: '', itemType: itemTypes[0] }); // Reset form to default values
    }, []);

    const handleInputChange = useCallback((key: keyof Omit<ItemData, 'id'>, value: any) => {
        if (key === 'quantity') {
            const parsedValue = parseInt(value);
            setNewItem({ ...newItem, [key]: isNaN(parsedValue) ? 0 : parsedValue });
        } else {
            setNewItem({ ...newItem, [key]: value });
        }
    }, [newItem]);

    const handleSubmit = useCallback(() => {
            if (editItemId) {
                // Update existing item
                setItems(
                    items.map((item) =>
                        item.id === editItemId ? { ...item, ...newItem } : item
                    )
                );
            } else {
                // Add new item with a unique ID
                setItems(Array.isArray(items) ? [...items, { ...newItem, id: generateUniqueId() }] : [{ ...newItem, id: generateUniqueId() }]);
            }
            setShowForm(false);
            setNewItem({ id: '', title: '', description: '', quantity: 0, date: '', itemType: itemTypes[0] }); // Reset form
            setEditItemId(null); // Reset edit mode
        }, [items, newItem, editItemId]);

    const handleCancel = useCallback(() => {
        setShowForm(false);
        setNewItem({ id: '', title: '', description: '', quantity: 0, date: '', itemType: itemTypes[0] }); // Reset form to default values
        setEditItemId(null); // Reset edit mode
    }, []);

    const toggleDropdown = useCallback(() => {
        setShowDropdown(!showDropdown);
    }, [showDropdown]);

    const selectItemType = useCallback((type: string) => {
        setNewItem({ ...newItem, itemType: type });
        setShowDropdown(false);
    }, [newItem]);

    const handleEditItem = useCallback((item: ItemData) => {
        setNewItem({ ...item });
        setShowForm(true);
        setEditItemId(item.id);
    }, []);

    const generateUniqueId = () => {
        return Date.now().toString() + Math.random().toString(36).substring(2, 9);
    };

    return (
        <view className="home-page">
            <view className="home-page">
                  <view className="list-container">
                      {items && items.map ? items.map((item, index) => (
                          <view key={item.id} className="list-item" bindtap={() => handleEditItem(item)}>
                              <text>Title: {item.title}</text>
                              <text>Description: {item.description}</text>
                              <text>Quantity: {item.quantity}</text>
                              {item.date && <text>Date: {item.date}</text>}
                              <text>Item Type: {item.itemType}</text>
                          </view>
                      )): <text>No items</text>}
                  </view>
            </view>

            <view className="add-button" bindtap={addItem}>
                <text>Add Item</text>
            </view>
            {showForm && (
                <view className='overlay'>
                    <view className="form-container">
                        <view className='form-item'>
                            <text>Title:</text>
                           <input
                                type="text"
                                className="input-field"
                                value={newItem.title}
                                onChange={(event) => handleInputChange('title', event.detail.value)}
                            />
                        </view>
                        <view className='form-item'>
                            <text>Description:</text>
                            <input
                                type="text"
                                className="input-field"
                                value={newItem.description}
                                onChange={(event) => handleInputChange('description', event.detail.value)}
                            />
                        </view>
                        <view className='form-item'>
                            <text>Quantity:</text>
                            <input
                                type="number"
                                className="input-field"
                                value={newItem.quantity.toString()}
                                onChange={(event) => handleInputChange('quantity', event.detail.value)}
                            />
                        </view>
                        <view className='form-item'>
                            <text>Date:</text>
                            <input
                                type="text"
                                className="input-field"
                                value={newItem.date || ""}
                                onChange={(event) => handleInputChange('date', event.detail.value)}
                            />
                        </view>
                        <view className="form-item dropdown-container">
                            <text>Item Type:</text>
                            <view className="dropdown-select" bindtap={toggleDropdown}>
                                <text>{newItem.itemType}</text>
                            </view>
                            {showDropdown && (
                                <view className="dropdown-options">
                                    {itemTypes.map((type) => (
                                        <text key={type} className="dropdown-option" bindtap={() => selectItemType(type)}>
                                            {type}
                                        </text>
                                    ))}
                                </view>
                            )}
                        </view>
                        <view className='button-container'>
                            <view className="form-button submit" bindtap={handleSubmit}>
                                <text>Submit</text>
                            </view>
                            <view className="form-button cancel" bindtap={handleCancel}>
                                <text>Cancel</text>
                            </view>
                        </view>
                    </view>
                </view>
            )}
        </view>
    );
}