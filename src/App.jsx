import React from 'react';
import Card from './components/Card';
import dcacLogo from './assets/images/image.png';
import Search from './components/Search';

const App = () => {
  return (
    <>
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
            {/* Contenedor para centrar el logo en pantallas pequeñas */}
            <div className="flex-1 flex justify-center md:justify-start">
              <img src={dcacLogo} className="h-12" alt="Logo" />
            </div>

            {/* Ocultar estos elementos en pantallas menores a 478px */}
            <div className="hidden sm:flex space-x-4 uppercase font-normal text-sm mr-4">
              <a href="#" className="text-gray-600">Operaciones</a>
              <a href="#" className="text-gray-600">Precios</a>
              <a href="#" className="text-gray-600">Consultas</a>
              <a href="#" className="text-gray-600">Perfil</a>
              <a href="#" className="text-gray-600">Clima</a>
            </div>
            <div className="hidden sm:flex space-x-2">
              <button className="bg-primary text-white px-6 py-2 rounded">Comprar</button>
              <button className="bg-green-500 text-white px-6 py-2 rounded">Cotizar</button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">Tendencias del mercado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              title="TERNEROS"
              mainValue="$ 2545,00"
              mainUnit="/Kg"
              trend="down"
              subItems={[
                { label: 'Terneras', value: '2323,00' },
                { label: 'Vaq. Preñada', value: '964,200' }
              ]}
            />
            <Card
              title="NOVILLITOS"
              mainValue="$ 2035"
              mainUnit="/Kg"
              trend="up"
              subItems={[
                { label: 'Ingreso', value: '0' },
                { label: 'I.N.M.C.', value: '1867,99' }
              ]}
            />
            <Card
              title="MAÍZ"
              mainValue="US$ 174,30"
              mainUnit=""
              trend="up"
              subItems={[
                { label: 'Soja', value: '308,70' },
                { label: 'Trigo', value: '220,80' }
              ]}
            />
            <Card
              title="DÓLAR"
              mainValue="$ 999,00"
              mainUnit=""
              trend="up"
              subItems={[
                { label: 'Divisa Compra', value: '976,00' },
                { label: 'No-Oficial Venta', value: '1180,00' }
              ]}
            />
          </div>
        </main>
        <Search />
      </div>
    </>
  );
};

export default App;
