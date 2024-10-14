import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import dcacLogo from './assets/images/image.png'

const MarketTrend = ({ title, mainValue, mainUnit, trend, subItems }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold">{mainValue}</span>
      <span className="text-sm ml-1">{mainUnit}</span>
      {trend === 'up' ? (
        <ArrowUpIcon className="w-4 h-4 text-green-500 ml-2" />
      ) : (
        <ArrowDownIcon className="w-4 h-4 text-red-500 ml-2" />
      )}
    </div>
    <div className="mt-2">
      {subItems.map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span>{item.label}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
    <button className="text-blue-500 text-sm mt-2">Ver más</button>
  </div>
);

const DeCampoACampo = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-primary text-white p-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>📞 011-7092-4870</span>
            <a href="#" className="text-white">Ayuda</a>
          </div>
          <button className="bg-red-500 px-3 py-1 rounded">Pedro Genta</button>
        </div>
      </header>
      
      <nav className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4">
          <img
            src={dcacLogo}
          />
          <div className="space-x-2 uppercase font-normal text-sm">
            <a href="#" className="text-gray-600">Operaciones</a>
            <a href="#" className="text-gray-600">Precios</a>
            <a href="#" className="text-gray-600">Consultas</a>
            <a href="#" className="text-gray-600">Perfil</a>
            <a href="#" className="text-gray-600">Clima</a>
          </div>
          <div className='space-x-2'>
            <button className="bg-primary text-white px-6 py-2 rounded">Comprar</button>
            <button className="bg-green-500 text-white px-6 py-2 rounded">Cotizar</button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Tendencias del mercado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MarketTrend
            title="TERNEROS"
            mainValue="$ 2545,00"
            mainUnit="/Kg"
            trend="down"
            subItems={[
              { label: "Terneras", value: "2323,00" },
              { label: "Vaq. Preñada", value: "964,200" }
            ]}
          />
          <MarketTrend
            title="NOVILLITOS"
            mainValue="$ 2035"
            mainUnit="/Kg"
            trend="up"
            subItems={[
              { label: "Ingreso", value: "0" },
              { label: "I.N.M.C.", value: "1867,99" }
            ]}
          />
          <MarketTrend
            title="MAÍZ"
            mainValue="US$ 174,30"
            mainUnit=""
            trend="up"
            subItems={[
              { label: "Soja", value: "308,70" },
              { label: "Trigo", value: "220,80" }
            ]}
          />
          <MarketTrend
            title="DÓLAR"
            mainValue="$ 999,00"
            mainUnit=""
            trend="up"
            subItems={[
              { label: "Divisa Compra", value: "976,00" },
              { label: "No-Oficial Venta", value: "1180,00" }
            ]}
          />
        </div>
      </main>
    </div>
  );
};

export default DeCampoACampo;