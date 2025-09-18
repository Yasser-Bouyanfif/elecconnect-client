import React from 'react';
import { ArrowRight, Zap, Wifi, Shield } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  banner: {
    url: string;
  };
  features: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const SERVER_URL = "https://images.pexels.com";

  const getIcon = (feature: string) => {
    if (feature.includes('kW') || feature.includes('Charge')) return <Zap className="w-4 h-4" />;
    if (feature.includes('WiFi') || feature.includes('App')) return <Wifi className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img 
          src={`${SERVER_URL}${product.banner.url}`}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          Professionnel
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
        </div>

        <div className="space-y-2">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 text-sm text-slate-700">
              <div className="text-emerald-600">
                {getIcon(feature)}
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="text-2xl font-bold text-slate-800">
              {product.price.toLocaleString()}€
            </span>
            <span className="text-slate-500 text-sm ml-1">HT</span>
          </div>

          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors flex items-center space-x-2 group">
            <span className="text-sm font-medium">Devis</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}