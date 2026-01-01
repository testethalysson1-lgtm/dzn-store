
'use client';

import { useState } from 'react';
import { Search, Moon, Sun, Menu, X, ShoppingCart, Star, Zap } from 'lucide-react';

type GameItem = {
  id: number;
  title: string;
  price: string;
  discount: string;
  description: string[];
  image: string;
  checkout: string;
};

type CoinItem = {
  id: number;
  title: string;
  price: string;
  discount: string;
  image: string;
  checkout: string;
};

export default function Page() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'contas' | 'moedas'>('contas');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const games: GameItem[] = [
    {
      id: 1,
      title: 'Trio MSN',
      price: 'R$ 59,99',
      discount: 'OFERTA',
      description: ['Conta com trio MSN', 'Pelé 107 + Zaga perfeita', '3281 de Força'],
      image: 'https://i.imgur.com/dFxiPFW.png',
      checkout: 'https://lxpay.com.br/checkout/2a0fe751-417c-4b23-895b-578c6059093d?offer=427a7110-902f-4a93-8968-f232fce01611',
    },
    {
      id: 2,
      title: 'Conta braba com Ney',
      price: 'R$ 29,99',
      discount: 'CUSTO BENEFICIO',
      description: ['Melhor carta do Neymar', 'Messi Blitz curler', 'Melhor goleiro do jogo', '3202 de força'],
      image: 'https://i.imgur.com/jmQ7vB2.png',
      checkout: 'https://lxpay.com.br/checkout/d56da249-0a91-4c84-9120-a65e692b98d1?offer=449144fb-b63a-4fa8-8182-6b2951862de7',
    },
    {
      id: 3,
      title: 'Conta full | A MELHOR DO GAME!',
      price: 'R$ 99,99',
      discount: 'A MAIS BRABA',
      description: ['O Ataque mais fatal do jogo!', 'Melhor goleiro do jogo', 'Uma das melhores contas do Efootball!', '3291 de Força'],
      image: 'https://i.imgur.com/sQv62ja.png',
      checkout: 'https://lxpay.com.br/checkout/1aff42cd-88e7-4ad8-8853-4524e6d5116a?offer=0654753a-c4ff-45d8-97a2-510c0911fcf5',
    },
  ];

  const coins: CoinItem[] = [
    {
      id: 1,
      title: 'Pacote com 2.130 Moedas',
      price: 'R$ 45,49',
      discount: 'OFERTA',
      image: 'https://i.imgur.com/tzfnzgV.png',
      checkout: 'https://lxpay.com.br/checkout/ba225301-c1de-48e7-b805-56e1520d58ac?offer=04832606-b57c-43bc-9aa1-db71097fbc6f',
    },
    {
      id: 2,
      title: 'Pacote com 5.700 Moedas',
      price: 'R$ 139,75',
      discount: 'POPULAR',
      image: 'https://i.imgur.com/tzfnzgV.png',
      checkout: 'https://lxpay.com.br/checkout/553b811f-4a65-4d85-8fe5-4f5bbeaa8d51?offer=3d9cfe42-8663-4920-ae0f-d36eb85e250d',
    },
    {
      id: 3,
      title: 'Pacote com 12.800 Moedas',
      price: 'R$ 250,00',
      discount: 'MELHOR VALOR',
      image: 'https://i.imgur.com/tzfnzgV.png',
      checkout: 'https://lxpay.com.br/checkout/5201b2ff-ad3f-4c62-9e61-a75992494b63?offer=1b7897ae-6779-4907-ad51-279655e3ae3f',
    },
  ];

  const isDark = theme === 'dark';

  return (
    <div
      className="min-h-screen text-white transition-all duration-500 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: 'url(https://i.imgur.com/jQxZ45g.png)' }}
    >
      {/* Overlay gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none z-0"></div>
      
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10 pointer-events-none z-0 animate-pulse"></div>

      <div className="relative z-10">
        <header className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 py-5 px-6 sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <img 
                  src="https://i.imgur.com/A2G2M5x.png" 
                  alt="Dzn Efootball" 
                  className="w-14 h-14 rounded-xl relative z-10 border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-all transform group-hover:scale-110"
                />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                Dzn Efootball
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMenu}
                className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/50 text-white transform hover:scale-105"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50 transform hover:scale-105"
              >
                {isDark ? <Sun className="text-yellow-300" size={20} /> : <Moon className="text-blue-200" size={20} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="mt-6 p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => {
                    setActiveSection('contas');
                    setMenuOpen(false);
                  }}
                  className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center gap-2 ${
                    activeSection === 'contas'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/50 border-2 border-cyan-400'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border-2 border-gray-600/50'
                  }`}
                >
                  <Zap size={20} />
                  Contas Premium
                </button>
                <button
                  onClick={() => {
                    setActiveSection('moedas');
                    setMenuOpen(false);
                  }}
                  className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center gap-2 ${
                    activeSection === 'moedas'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/50 border-2 border-cyan-400'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border-2 border-gray-600/50'
                  }`}
                >
                  <Star size={20} />
                  Moedas
                </button>
              </div>
            </div>
          )}
        </header>

        <section className="px-6 py-24 text-center max-w-5xl mx-auto">
          <div className="mb-16 transform hover:scale-105 transition-transform duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-3xl blur-2xl"></div>
              <img 
                src="https://i.imgur.com/bYS1ImS.png" 
                alt="Banner GameStore" 
                className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl shadow-cyan-500/40 border-4 border-cyan-400/50 relative z-10"
              />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            {activeSection === 'contas' ? '⚡ Contas Premium' : '💎 Moedas Premium'}
          </h1>
          <p className="text-2xl mb-12 text-cyan-200 font-semibold drop-shadow-lg animate-in fade-in slide-in-from-bottom-7 duration-700 delay-100">
            {activeSection === 'contas' 
              ? '🔥 As melhores contas do mercado | Entrega instantânea'
              : '💰 Recarregue com segurança | Preços imbatíveis'}
          </p>

          <div className="relative max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-9 duration-700 delay-200">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-30"></div>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-400 z-10" />
            <input
              placeholder={activeSection === 'contas' ? '🔍 Buscar contas...' : '🔍 Buscar moedas...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-5 rounded-2xl text-lg border-2 outline-none bg-black/50 backdrop-blur-xl border-cyan-500/50 focus:border-cyan-400 placeholder-cyan-300/60 text-white shadow-xl relative z-10 transition-all"
            />
          </div>
        </section>

        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {activeSection === 'contas' ? (
              games.map((item, index) => (
                <div
                  key={item.id}
                  className="group rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-72 w-full object-contain bg-gradient-to-br from-gray-900 to-black transform group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-xl shadow-green-500/50 flex items-center gap-2 border-2 border-green-300">
                        <Zap size={16} />
                        {item.discount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-7">
                    <h3 className="text-2xl font-black mb-3 text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                    
                    <div className="mb-4 space-y-2">
                      {item.description.map((desc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-cyan-200 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                          <span>{desc}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-5">
                      {item.price}
                    </p>
                    <a 
                      href={item.checkout}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl font-black shadow-xl shadow-cyan-500/50 transition-all transform hover:scale-105 hover:shadow-2xl border-2 border-cyan-400/50 hover:border-cyan-300"
                    >
                      <ShoppingCart size={20} />
                      COMPRAR AGORA
                    </a>
                  </div>
                </div>
              ))
            ) : (
              coins.map((item, index) => (
                <div
                  key={item.id}
                  className="group rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-72 w-full object-contain bg-gradient-to-br from-gray-900 to-black transform group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-xl shadow-green-500/50 flex items-center gap-2 border-2 border-green-300">
                        <Zap size={16} />
                        {item.discount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-7">
                    <h3 className="text-2xl font-black mb-3 text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                    
                    <p className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-5">
                      {item.price}
                    </p>
                    <a 
                      href={item.checkout}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl font-black shadow-xl shadow-cyan-500/50 transition-all transform hover:scale-105 hover:shadow-2xl border-2 border-cyan-400/50 hover:border-cyan-300"
                    >
                      <ShoppingCart size={20} />
                      COMPRAR AGORA
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="bg-black/60 backdrop-blur-xl border-t border-cyan-500/30 py-12 text-center mt-20">
          <div className="text-cyan-300/70 font-semibold text-lg mb-3">
            © 2024 Dzn Efootball. Todos os direitos reservados.
          </div>
          <div className="text-cyan-400 font-bold text-lg">
            Suporte 24H no nosso Instagram @dznstore2026
          </div>
        </footer>
      </div>
    </div>
  );
}