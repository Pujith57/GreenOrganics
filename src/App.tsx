import React, { useState } from 'react';
import { Search, Phone, Mail } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { products } from './data/products';
import { CartItem, Product, ShippingInfo } from './types';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDietary = selectedDietary.length === 0 ||
                          selectedDietary.every(diet => product.dietary.includes(diet));
    return matchesSearch && matchesDietary;
  });

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = (shippingInfo: ShippingInfo) => {
    // Here you would typically integrate with a payment gateway
    console.log('Processing order:', { items: cartItems, shippingInfo });
    alert('Order placed successfully! Thank you for your purchase.');
    setCartItems([]);
    setIsCheckout(false);
  };

  const allDietary = Array.from(
    new Set(products.flatMap(product => product.dietary))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">Organic Baby Foods</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-gray-500" />
                <span>1-800-ORGANIC</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-gray-500" />
                <span>support@organicbaby.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isCheckout ? (
          <Checkout items={cartItems} onSubmit={handleCheckout} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {allDietary.map(diet => (
                    <button
                      key={diet}
                      onClick={() => setSelectedDietary(prev =>
                        prev.includes(diet)
                          ? prev.filter(d => d !== diet)
                          : [...prev, diet]
                      )}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedDietary.includes(diet)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <Cart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={() => setIsCheckout(true)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;