import { useState } from 'react';
import { X } from 'lucide-react';

export type ShopItemType =
  | 'Species'
  | 'Habitat'
  | 'Accessory'
  | 'Pattern'
  | 'Hat'
  | 'Color';

interface ShopItemFormProps {
  onSubmit: (data: {
    itemName: string;
    itemType: string;
    itemColor: string;
    itemCost: number;
    itemDescription?: string;
  }) => void;
  onCancel: () => void;
}

export function ShopItemForm({ onSubmit, onCancel }: ShopItemFormProps) {
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState<ShopItemType>('Pattern');
  const [itemColor, setItemColor] = useState('');
  const [itemCost, setItemCost] = useState<string>('');
  const [itemDescription, setItemDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    if (!itemColor.trim()) return;
    if (!itemCost || parseInt(itemCost, 10) <= 0) return;

    onSubmit({
      itemName: itemName.trim(),
      itemType,
      itemColor: itemColor.trim(),
      itemCost: parseInt(itemCost, 10),
      itemDescription: itemDescription.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Create Shop Item</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Type *
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value as ShopItemType)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="Species">Species</option>
              <option value="Habitat">Habitat</option>
              <option value="Accessory">Accessory</option>
              <option value="Pattern">Pattern</option>
              <option value="Hat">Hat</option>
              <option value="Color">Color</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Color *
            </label>
            <input
              type="text"
              value={itemColor}
              onChange={(e) => setItemColor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter item color"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost (Points) *
            </label>
            <input
              type="number"
              value={itemCost}
              onChange={(e) => setItemCost(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter cost in points"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter item description (optional)"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold"
            >
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
