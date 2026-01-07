
'use client';

import { useState } from 'react';
import { Search, Moon, Sun, Menu, X, ShoppingCart, Star, Zap, Shield, Clock, MessageCircle } from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState<'mobile' | 'console'>('mobile');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const games: GameItem[] = [
    {
      id: 1,
      title: 'Conta com Ney 107 - O BRABO',
      price: 'R$ 24,99',
      discount: 'OFERTA',
      description: ['Ney 107 - Uma das melhores versões do Neymar!', 'Mbappe Showtime', 'Defesa Brutal', '3187 de Força Coletiva'],
      image: 'https://i.imgur.com/hny2adX.png',
      checkout: 'https://lxpay.com.br/checkout/7b46f4ca-f693-40ee-bb22-0f2a8d813e39?offer=2fddebe6-6b1c-4a76-b5e9-8071e7ab3986',
    },
    {
      id: 2,
      title: 'Conta com Ney Loiro',
      price: 'R$ 44,99',
      discount: 'MAIS PROCURADO',
      description: ['Ney Loiro - O mais Procurado', '3200 de Força Coletiva', 'O Messi mais raro do Jogo!', 'Defesa perfeita'],
      image: 'https://i.imgur.com/Dorftdg.png',
      checkout: 'https://lxpay.com.br/checkout/5dce45fe-ed54-4e52-9080-728591b9de22?offer=923129e7-56af-49d7-afab-b30c8dc849a7',
    },
    {
      id: 3,
      title: 'O Quarteto fantástico - TIME IMPARÁVEL',
      price: 'R$ 69,99',
      discount: 'POPULAR',
      description: ['Ataque Fatal', 'As melhores cartas do Game', 'Time perfeito pra humilhar seu adversário', '3254 de Força Coletiva'],
      image: 'https://i.imgur.com/Puzm5lh.png',
      checkout: 'https://lxpay.com.br/checkout/6c94fa32-c867-45ad-a0b3-560f193469a4?offer=5360c6df-adae-4e16-87c9-3f46f5a649aa',
    },
    {
      id: 4,
      title: 'Os Dribladores! Conta com Ney e Yamal',
      price: 'R$ 74,99',
      discount: 'FIRULAS',
      description: ['Conta com Ney e Yamal', 'Pelé - O CA Matador', 'Conta perfeita pra quem gosta de FIRULAS!', '3255 de Força Coletiva'],
      image: 'https://i.imgur.com/7JKhjLD.png',
      checkout: 'https://lxpay.com.br/checkout/c4671bf1-f71c-4009-b1e2-1c807481ce63?offer=828e6185-fd50-454b-96c2-15f85ed3057d',
    },
    {
      id: 5,
      title: 'A conta mais Zica do jogo!',
      price: 'R$ 139,99',
      discount: 'A MAIS FORTE',
      description: ['Uma das mais fortes do eFootball', 'Novo Messi 109 + Pelé e Ney no Ataque', 'Meio campo e Defesa perfeitos', '3286 de Força Coletiva'],
      image: 'https://i.imgur.com/oBYyxxm.png',
      checkout: 'https://lxpay.com.br/checkout/c0ebc04b-ba48-48ad-83ce-39aa49235af9?offer=e46ec93e-b3b3-4920-b5cf-419de9a0fda0',
    },
  ];

  const consoleGames: GameItem[] = [
    {
      id: 1,
      title: 'Conta com Cr7 + Pelé',
      price: 'R$ 54,99',
      discount: 'DESTAQUE',
      description: ['Conta com Cr7 e Pelé', 'Ataque brutal', 'Ronaldinho + meio campo excelente', '3230 de Força Coletiva'],
      image: 'https://i.imgur.com/ncIXC5O.png',
      checkout: 'https://lxpay.com.br/checkout/b2c55cde-218b-4eb1-8800-d95f5dddf12f?offer=561e33ec-a213-4201-a63e-d4e2c86f775e',
    },
    {
      id: 2,
      title: 'Melhor Ataque do Console!',
      price: 'R$ 79,99',
      discount: 'MELHOR ATAQUE',
      description: ['Melhor Ataque do Game!', 'Etoo + R10', 'Meio campo e Defesa excelentes', '3265 de Força Coletiva'],
      image: 'https://i.imgur.com/NLgzU3O.png',
      checkout: 'https://lxpay.com.br/checkout/b2c55cde-218b-4eb1-8800-d95f5dddf12f?offer=561e33ec-a213-4201-a63e-d4e2c86f775e',
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
        <header className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 py-3 px-4 md:py-5 md:px-6 sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <img 
                  src="https://i.imgur.com/A2G2M5x.png" 
                  alt="Dzn Efootball" 
                  className="w-9 h-9 md:w-14 md:h-14 rounded-xl relative z-10 border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-all transform group-hover:scale-110"
                />
              </div>
              <span className="text-base md:text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                Dzn Efootball
              </span>
            </div>
            
            <div className="flex items-center gap-2 order-first md:order-none">
              <button
                onClick={toggleMenu}
                className="p-2 md:p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/50 text-white transform hover:scale-105"
              >
                {menuOpen ? <X size={16} className="md:w-5 md:h-5" /> : <Menu size={16} className="md:w-5 md:h-5" />}
              </button>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 md:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50 transform hover:scale-105"
            >
              {isDark ? <Sun className="text-yellow-300" size={16} /> : <Moon className="text-blue-200" size={16} />}
            </button>
          </div>

          {menuOpen && (
            <div className="mt-3 md:mt-6 p-3 md:p-6 rounded-xl md:rounded-2xl bg-black/60 backdrop-blur-xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 animate-in fade-in slide-in-from-left-5 duration-300">
              <div className="flex flex-col gap-2 md:gap-4">
                <button
                  onClick={() => {
                    setActiveSection('mobile');
                    setMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 md:px-8 md:py-4 rounded-lg md:rounded-xl text-xs md:text-base font-bold transition-all transform hover:scale-105 flex items-center gap-1.5 md:gap-2 ${
                    activeSection === 'mobile'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/50 border-2 border-cyan-400'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border-2 border-gray-600/50'
                  }`}
                >
                  <Zap size={14} className="md:w-5 md:h-5" />
                  Mobile
                </button>
                <button
                  onClick={() => {
                    setActiveSection('console');
                    setMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 md:px-8 md:py-4 rounded-lg md:rounded-xl text-xs md:text-base font-bold transition-all transform hover:scale-105 flex items-center gap-1.5 md:gap-2 ${
                    activeSection === 'console'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/50 border-2 border-cyan-400'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border-2 border-gray-600/50'
                  }`}
                >
                  <Star size={14} className="md:w-5 md:h-5" />
                  Console
                </button>
              </div>
            </div>
          )}
        </header>

        <section className="px-4 py-8 md:px-6 md:py-24 text-center max-w-5xl mx-auto">
          <div className="mb-6 md:mb-16 transform hover:scale-105 transition-transform duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-xl md:rounded-3xl blur-2xl"></div>
              <img 
                src="https://i.imgur.com/x1elyJr.png" 
                alt="Banner GameStore" 
                className="w-full max-w-4xl mx-auto rounded-xl md:rounded-3xl shadow-2xl shadow-cyan-500/40 border-2 md:border-4 border-cyan-400/50 relative z-10"
              />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            {activeSection === 'mobile' ? '📱 Contas Mobile' : '🎮 Contas Console'}
          </h1>
          <p className="text-sm md:text-2xl mb-6 md:mb-12 text-cyan-200 font-semibold drop-shadow-lg animate-in fade-in slide-in-from-bottom-7 duration-700 delay-100 px-2">
            {activeSection === 'mobile' 
              ? '🔥 As melhores contas do mercado | Entrega instantânea'
              : '🎯 Contas exclusivas para Console | Máximo desempenho'}
          </p>

          <div className="relative max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-9 duration-700 delay-200">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg md:rounded-2xl blur-xl opacity-30"></div>
            <Search className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 text-cyan-400 z-10" />
            <input
              placeholder={activeSection === 'mobile' ? '🔍 Buscar contas mobile...' : '🔍 Buscar contas console...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-14 pr-3 md:pr-5 py-2.5 md:py-5 rounded-lg md:rounded-2xl text-sm md:text-lg border-2 outline-none bg-black/50 backdrop-blur-xl border-cyan-500/50 focus:border-cyan-400 placeholder-cyan-300/60 text-white shadow-xl relative z-10 transition-all"
            />
          </div>
        </section>

        <section className="px-4 py-6 md:px-6 md:py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {activeSection === 'mobile' ? (
              games.map((item, index) => (
                <div
                  key={item.id}
                  className="group rounded-xl md:rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-40 md:h-72 w-full object-contain bg-gradient-to-br from-gray-900 to-black transform group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 md:top-4 right-2 md:right-4 z-20">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-black shadow-xl shadow-green-500/50 flex items-center gap-1 md:gap-2 border-2 border-green-300">
                        <Zap size={12} className="md:w-4 md:h-4" />
                        {item.discount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-7">
                    <h3 className="text-base md:text-2xl font-black mb-2 md:mb-3 text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                    
                    <div className="mb-3 md:mb-4 space-y-1 md:space-y-2">
                      {item.description.map((desc, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 md:gap-2 text-cyan-200 text-xs md:text-sm">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
                          <span>{desc}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3 md:mb-5">
                      {item.price}
                    </p>
                    <a 
                      href={item.checkout}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 md:gap-3 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2.5 md:py-4 rounded-lg md:rounded-xl text-xs md:text-base font-black shadow-xl shadow-cyan-500/50 transition-all transform hover:scale-105 hover:shadow-2xl border-2 border-cyan-400/50 hover:border-cyan-300"
                    >
                      <ShoppingCart size={14} className="md:w-5 md:h-5" />
                      COMPRAR AGORA
                    </a>
                  </div>
                </div>
              ))
            ) : (
              consoleGames.map((item, index) => (
                <div
                  key={item.id}
                  className="group rounded-xl md:rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-40 md:h-72 w-full object-contain bg-gradient-to-br from-gray-900 to-black transform group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 md:top-4 right-2 md:right-4 z-20">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-black shadow-xl shadow-green-500/50 flex items-center gap-1 md:gap-2 border-2 border-green-300">
                        <Zap size={12} className="md:w-4 md:h-4" />
                        {item.discount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-7">
                    <h3 className="text-base md:text-2xl font-black mb-2 md:mb-3 text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                    
                    <div className="mb-3 md:mb-4 space-y-1 md:space-y-2">
                      {item.description.map((desc, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 md:gap-2 text-cyan-200 text-xs md:text-sm">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
                          <span>{desc}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3 md:mb-5">
                      {item.price}
                    </p>
                    <a 
                      href={item.checkout}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 md:gap-3 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2.5 md:py-4 rounded-lg md:rounded-xl text-xs md:text-base font-black shadow-xl shadow-cyan-500/50 transition-all transform hover:scale-105 hover:shadow-2xl border-2 border-cyan-400/50 hover:border-cyan-300"
                    >
                      <ShoppingCart size={14} className="md:w-5 md:h-5" />
                      COMPRAR AGORA
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-12 md:px-6 md:py-20 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-black text-center mb-8 md:mb-16 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Perguntas Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="group bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400 rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <h3 className="text-base md:text-xl font-black text-cyan-300 mb-2 md:mb-3 text-center">
                Como funciona a compra no nosso site?
              </h3>
              <p className="text-xs md:text-sm text-cyan-100/80 text-center leading-relaxed">
                Basta escolher a conta em que você se interessou e clicar em comprar. Você será direcionado para a página de pagamento e lá tem a opção de colocar o seu gmail, esse gmail será usado pra transferência da conta via Konami ID e você irá receber todas as informações da entrega pelo gmail, só verificar sua caixa de gmail após a compra. Todas as nossas contas são apenas konami id para garantir a segurança do cliente.
              </p>
            </div>

            <div className="group bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400 rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-base md:text-xl font-black text-cyan-300 mb-2 md:mb-3 text-center">
                Porque confiar na Dzn Store?
              </h3>
              <p className="text-xs md:text-sm text-cyan-100/80 text-center leading-relaxed">
                Somos um site verificado desde 2024 sempre buscando a satisfação dos nossos clientes
              </p>
            </div>

            <div className="group bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400 rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Clock className="text-white" size={24} />
              </div>
              <h3 className="text-base md:text-xl font-black text-purple-300 mb-2 md:mb-3 text-center">
                Se eu comprar agora em quanto tempo recebo a conta?
              </h3>
              <p className="text-xs md:text-sm text-cyan-100/80 text-center leading-relaxed">
                Após a compra, você receberá em questão de minutos, sempre buscamos agilidade e satisfação pros nossos clientes
              </p>
            </div>

            <div className="group bg-black/40 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400 rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform">
                <MessageCircle className="text-white" size={24} />
              </div>
              <h3 className="text-base md:text-xl font-black text-green-300 mb-2 md:mb-3 text-center">
                Tenho dúvidas ainda
              </h3>
              <p className="text-xs md:text-sm text-cyan-100/80 text-center leading-relaxed">
                Caso tenha mais alguma dúvida só chamar no nosso Instagram, a equipe Dzn estará 24H online pra atendê-lo
              </p>
            </div>
          </div>
        </section>

        <footer className="bg-black/60 backdrop-blur-xl border-t border-cyan-500/30 py-6 md:py-12 text-center mt-8 md:mt-20 px-4">
          <div className="text-cyan-300/70 font-semibold text-xs md:text-lg mb-2 md:mb-3">
            © 2024 Dzn Efootball. Todos os direitos reservados.
          </div>
          <div className="text-cyan-400 font-bold text-xs md:text-lg">
            Suporte 24H no nosso Instagram @dznstore2026
          </div>
        </footer>
      </div>
    </div>
  );
}