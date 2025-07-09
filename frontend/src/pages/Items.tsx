import React, { useState, useEffect } from 'react';
import { Item } from '../types';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsData, categoriesData] = await Promise.all([
          itemsAPI.getAll(),
          itemsAPI.getCategories()
        ]);
        setItems(itemsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load items. Please try again.');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchItemsByCategory = async () => {
      try {
        setLoading(true);
        const itemsData = await itemsAPI.getAll(selectedCategory);
        setItems(itemsData);
      } catch (err) {
        setError('Failed to load items. Please try again.');
        console.error('Error fetching items by category:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory !== '') {
      fetchItemsByCategory();
    }
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse All Items
          </h1>
          <p className="text-lg text-gray-600">
            Discover fresh fruits, dairy, beverages, and more
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍎</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              {selectedCategory 
                ? `No items available in the "${selectedCategory}" category.`
                : 'No items available at the moment.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Results Count */}
        {items.length > 0 && (
          <div className="text-center mt-8 text-gray-600">
            Showing {items.length} item{items.length !== 1 ? 's' : ''}
            {selectedCategory && ` in ${selectedCategory}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Items; 