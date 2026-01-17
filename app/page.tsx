'use client';

import { useState } from 'react';
import { Search, Moon, Sun, Menu, X, ShoppingCart, Star, Zap, Shield, Clock, MessageCircle, TrendingDown } from 'lucide-react';

type GameItem = {
  id: number;
  title: string;
  price: string;
  oldPrice?: string;
  discount: string;
  description: string[];
  image: string;
  checkout: string;
  badge?: string;
};

export default function Page() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'mobile' | 'console'>('mobile');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleCard = (id: number) => setExpandedCard(expandedCard === id ? null : id);

  const games: GameItem[] = [
    {
      id: 1,
      title: 'Conta com Ney 107',
      price: 'R$ 24,99',
      oldPrice: 'R$ 49,99',
      discount: '50%',
      badge: 'ESGOTADO',
      description: ['Ney 107 - O BRABO', 'Mbappe Showtime', 'Defesa Brutal', '3187 de Força'],
      image: 'https://i.imgur.com/hny2adX.png',
      checkout: 'https://lxpay.com.br/checkout/7b46f4ca-f693-40ee-bb22-0f2a8d813e39?offer=2fddebe6-6b1c-4a76-b5e9-8071e7ab3986',
    },
    {
      id: 2,
      title: 'Conta com Ney Loiro',
      price: 'R$ 44,99',
      oldPrice: 'R$ 69,99',
      discount: '36%',
      description: ['Ney Loiro - O mais Procurado', '3200 de Força', 'Messi Raro', 'Defesa perfeita'],
      image: 'https://i.imgur.com/Dorftdg.png',
      checkout: 'https://lxpay.com.br/checkout/5dce45fe-ed54-4e52-9080-728591b9de22?offer=923129e7-56af-49d7-afab-b30c8dc849a7',
    },
    {
      id: 3,
      title: 'Quarteto Fantástico',
      price: 'R$ 69,99',
      oldPrice: 'R$ 79,99',
      discount: '13%',
      description: ['TIME IMPARÁVEL', 'Ataque Fatal', 'Melhores cartas', '3254 de Força'],
      image: 'https://i.imgur.com/Puzm5lh.png',
      checkout: 'https://lxpay.com.br/checkout/6c94fa32-c867-45ad-a0b3-560f193469a4?offer=5360c6df-adae-4e16-87c9-3f46f5a649aa',
    },
    {
      id: 4,
      title: 'Os Dribladores',
      price: 'R$ 74,99',
      oldPrice: 'R$ 99,99',
      discount: '25%',
      description: ['Ney e Yamal', 'Pelé CA Matador', 'Perfeito pra FIRULAS', '3255 de Força'],
      image: 'https://i.imgur.com/7JKhjLD.png',
      checkout: 'https://lxpay.com.br/checkout/c4671bf1-f71c-4009-b1e2-1c807481ce63?offer=828e6185-fd50-454b-96c2-15f85ed3057d',
    },
    {
      id: 5,
      title: 'A Conta Mais Zica',
      price: 'R$ 139,99',
      oldPrice: 'R$ 200,00',
      discount: '30%',
      description: ['Mais forte do eFootball', 'Messi 109 + Pelé + Ney', 'Defesa perfeita', '3286 de Força'],
      image: 'https://i.imgur.com/oBYyxxm.png',
      checkout: 'https://lxpay.com.br/checkout/c0ebc04b-ba48-48ad-83ce-39aa49235af9?offer=e46ec93e-b3b3-4920-b5cf-419de9a0fda0',
    },
    {
      id: 6,
      title: 'A Melhor Conta',
      price: 'R$ 500,00',
      oldPrice: 'R$ 999,99',
      discount: '50%',
      description: ['Melhor que você já viu', 'Ataque perfeito', 'Messi + Gullit', '3301 de Força'],
      image: 'https://i.imgur.com/VuBE0hE.png',
      checkout: 'https://lxpay.com.br/checkout/818d5b90-f9c9-4448-a890-c785cfc58a20?offer=093b7131-3d6a-450d-8604-6aad356ef1d9',
    },
  ];

  const consoleGames: GameItem[] = [
    {
      id: 1,
      title: 'Cr7 + Pelé',
      price: 'R$ 54,99',
      discount: '20%',
      description: ['Cr7 e Pelé', 'Ataque brutal', 'Ronaldinho R10', '3230 de Força'],
      image: 'https://i.imgur.com/ncIXC5O.png',
      checkout: 'https://lxpay.com.br/checkout/b2c55cde-218b-4eb1-8800-d95f5dddf12f?offer=561e33ec-a213-4201-a63e-d4e2c86f775e',
    },
    {
      id: 2,
      title: 'Melhor Ataque Console',
      price: 'R$ 79,99',
      discount: '35%',
      description: ['Melhor Ataque do Game', 'Etoo + R10', 'Defesa excelente', '3265 de Força'],
      image: 'https://i.imgur.com/NLgzU3O.png',
      checkout: 'https://lxpay.com.br/checkout/b2c55cde-218b-4eb1-8800-d95f5dddf12f?offer=561e33ec-a213-4201-a63e-d4e2c86f775e',
    },
  ];

  const renderCard = (item: GameItem, index: number) => {
    const isExpanded = expandedCard === item.id;
    
    return (
      <div key={item.id} className="relative group" style={{ animationDelay: `${index * 50}ms` }}>
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 ${isExpanded ? 'md:col-span-2 md:row-span-2' : ''}`}>
          
          {/* Badge Esgotado */}
          {item.badge && (
            <div className="absolute top-3 left-3 z-20 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-white font-black text-xs tracking-wider">{item.badge}</span>
            </div>
          )}
          
          {/* Imagem - Clicável */}
          <div 
            onClick={() => toggleCard(item.id)}
            className={`relative bg-gradient-to-br from-purple-950/50 to-pink-950/50 overflow-hidden cursor-pointer transition-all duration-500 ${isExpanded ? 'h-72 md:h-96' : 'h-44'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <img src={item.image} alt={item.title} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500" />
            
            {/* Logo/Marca sobreposta */}
            <div className="absolute top-3 right-3 z-20 bg-purple-600/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-400/30">
              <span className="text-white font-black text-[10px] tracking-widest">DZN STORE</span>
            </div>
            
            {/* Indicador de expansão */}
            {!isExpanded && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-purple-600/80 backdrop-blur-sm px-3 py-1 rounded-full animate-pulse">
                <span className="text-white font-bold text-xs">👆 Ver Detalhes</span>
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="p-4 space-y-3">
            <h3 
              onClick={() => toggleCard(item.id)}
              className={`text-white font-black uppercase tracking-wide leading-tight cursor-pointer hover:text-purple-300 transition-all duration-300 ${isExpanded ? 'text-lg md:text-2xl' : 'text-sm'}`}
            >
              {item.title}
            </h3>
            
            {/* Descrição expandível */}
            <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-2 mb-4 pt-3 border-t border-purple-500/20">
                {item.description.map((desc, idx) => (
                  <div key={idx} className={`flex items-start gap-2 text-purple-200 transition-all duration-300 ${isExpanded ? 'text-sm md:text-base' : 'text-xs'}`}>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex-shrink-0 mt-1.5"></div>
                    <span className="leading-relaxed font-medium">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Preços */}
            <div className="flex items-center gap-2">
              <div>
                {item.oldPrice && (
                  <p className={`text-purple-300/60 line-through font-semibold transition-all duration-300 ${isExpanded ? 'text-sm md:text-base' : 'text-xs'}`}>{item.oldPrice}</p>
                )}
                <p className={`text-white font-black transition-all duration-300 ${isExpanded ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{item.price}</p>
                <p className={`text-purple-200/70 transition-all duration-300 ${isExpanded ? 'text-xs' : 'text-[10px]'}`}>À vista no PIX</p>
              </div>
              
              {/* Badge de desconto */}
              <div className={`ml-auto flex items-center gap-1 bg-green-500/90 backdrop-blur-sm rounded-lg transition-all duration-300 ${isExpanded ? 'px-3 py-2' : 'px-2 py-1'}`}>
                <TrendingDown size={isExpanded ? 16 : 12} className="text-white" />
                <span className={`text-white font-black transition-all duration-300 ${isExpanded ? 'text-sm' : 'text-xs'}`}>{item.discount}</span>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-2">
              <button
                onClick={() => toggleCard(item.id)}
                className={`w-full bg-purple-700/30 hover:bg-purple-700/50 text-purple-200 rounded-xl font-bold text-center transition-all border border-purple-500/30 ${isExpanded ? 'py-3 text-sm' : 'py-2 text-xs'}`}
              >
                {isExpanded ? '⬆️ Ver Menos' : '⬇️ Ver Detalhes'}
              </button>
              
              <a 
                href={item.checkout} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-black text-center transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30 ${isExpanded ? 'py-3 text-base' : 'py-2.5 text-sm'}`}
              >
                🛒 Comprar Agora
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-pink-950/30 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-xl border-b border-purple-500/20 py-3 px-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="https://i.imgur.com/A2G2M5x.png" alt="Dzn" className="w-10 h-10 rounded-xl border-2 border-purple-500/50" />
              <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dzn Store</span>
            </div>
            
            <button onClick={toggleMenu} className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 transition-all">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {menuOpen && (
            <div className="mt-4 p-4 rounded-xl bg-purple-950/50 backdrop-blur-xl border border-purple-500/30">
              <div className="flex flex-col gap-2">
                <button onClick={() => { setActiveSection('mobile'); setMenuOpen(false); }} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'mobile' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-purple-900/30 text-purple-200 hover:bg-purple-900/50'}`}>
                  📱 Mobile
                </button>
                <button onClick={() => { setActiveSection('console'); setMenuOpen(false); }} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'console' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-purple-900/30 text-purple-200 hover:bg-purple-900/50'}`}>
                  🎮 Console
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Hero */}
        <section className="px-4 py-8 text-center max-w-5xl mx-auto">
          <div className="mb-8">
            <img src="https://i.imgur.com/GQMBqhU.png" alt="Banner" className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl shadow-purple-500/20 border-2 border-purple-500/30" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            {activeSection === 'mobile' ? 'Contas Mobile' : 'Contas Console'}
          </h1>
          <p className="text-purple-200 mb-6 font-semibold">
            🔥 As melhores contas | Entrega instantânea
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input placeholder="🔍 Buscar contas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none bg-purple-950/30 backdrop-blur-xl border-purple-500/30 focus:border-purple-400 placeholder-purple-300/50 text-white transition-all" />
          </div>
        </section>

        {/* Grid de Contas */}
        <section className="px-4 py-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(activeSection === 'mobile' ? games : consoleGames).map(renderCard)}
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Perguntas Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: ShoppingCart, title: 'Como funciona a compra?', text: 'Escolha a conta, clique em comprar e será direcionado para pagamento. Coloque seu Gmail para receber a transferência via Konami ID. Todas as contas são seguras!' },
              { icon: Shield, title: 'Por que confiar na Dzn?', text: 'Somos verificados desde 2024, sempre buscando satisfação. Mais de 200 clientes já compraram!' },
              { icon: Clock, title: 'Quanto tempo para receber?', text: 'Entrega em segundos! Verifique sua caixa de entrada do Gmail após a compra.' },
              { icon: MessageCircle, title: 'Tem dúvidas?', text: 'Chame no Instagram! Equipe 24h online: @dznstore2026' }
            ].map((faq, i) => (
              <div key={i} className="bg-purple-950/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all hover:scale-[1.02]">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 mx-auto">
                  <faq.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-black text-purple-300 mb-2 text-center">{faq.title}</h3>
                <p className="text-sm text-purple-100/70 text-center leading-relaxed">{faq.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/80 backdrop-blur-xl border-t border-purple-500/20 py-8 text-center px-4">
          <p className="text-purple-300/70 text-sm mb-2">© 2024 Dzn Efootball. Todos os direitos reservados.</p>
          <p className="text-purple-400 font-bold">Suporte 24H: @dznstore2026</p>
        </footer>
      </div>
    </div>
  );
}