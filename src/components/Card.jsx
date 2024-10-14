import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const Card = ({ title, mainValue, mainUnit, trend, subItems }) => (
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

export default Card;