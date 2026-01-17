
'use client';

import { useState } from 'react';
import { Search, Moon, Sun, Menu, X, ShoppingCart, Star, Zap, Shield, Clock, MessageCircle, TrendingDown, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

type GameItem = {
  id: number;
  title: string;
  price: string;
  oldPrice?: string;
  discount: string;
  description: string[];
  images: string[];
  checkout: string;
  badge?: string;
};

export default function Page() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'mobile' | 'console'>('mobile');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleCard = (id: number) => setExpandedCard(expandedCard === id ? null : id);
  
  const openDetails = (item: GameItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const closeDetails = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedItem.images.length);
    }
  };

  const prevImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length);
    }
  };

  const games: GameItem[] = [
    {
      id: 1,
      title: 'Conta com CR7 + Iniesta',
      price: 'R$ 24,99',
      oldPrice: 'R$ 49,99',
      discount: '50%',
      description: ['Conta perfeita pra você que ta com pouca grana', 'Cr7 + Ibra + Iniesta', 'Meio campo ótimo', '3237 de Força Coletiva'],
      images: [
        'https://i.imgur.com/wWWwhNM.png',
        'https://i.imgur.com/plUBEzZ.png',
        'https://i.imgur.com/0UBGHPy.png',
        'https://i.imgur.com/jSL1AX8.png'
      ],
      checkout: 'https://lxpay.com.br/checkout/f7233f4f-ba51-4b7f-93a5-ea6bb33a663f?offer=ce3cf6c0-370e-47e1-a529-943ecc0ac4f9',
    },
    {
      id: 2,
      title: 'Ney Loiro + O Messi mais raro',
      price: 'R$ 44,99',
      oldPrice: 'R$ 69,99',
      discount: '36%',
      description: ['Conta com Ney Loiro + Messi mais raro', 'Diversos jogadores antigos', 'Uma das reliquias do game', 'Perfeita pra quem gosta de coleção antiga', '3206+ de Força Coletiva'],
      images: [
        'https://i.imgur.com/z9qqw53.png',
        'https://i.imgur.com/mibK0Wn.png',
        'https://i.imgur.com/3toi3lr.png',
        'https://i.imgur.com/u9JKv0c.png',
        'https://i.imgur.com/sYr80bX.png',
        'https://i.imgur.com/EUNPz3t.png'
      ],
      checkout: 'https://lxpay.com.br/checkout/182fa30d-84fc-471a-a81a-53bb31344242?offer=ad8947ba-5c33-45bf-bb81-3a65766c51a4',
    },
    {
      id: 3,
      title: 'O QUARTETO FANTÁSTICO',
      price: 'R$ 69,99',
      oldPrice: 'R$ 79,99',
      discount: '13%',
      description: ['Neymar | Ronaldinho | Dembele', 'Vitinha dominando o meio campo', 'Zaga excelente', '3231 de Força Coletiva'],
      images: [
        'https://i.imgur.com/BAn0vIC.png',
        'https://i.imgur.com/TshbKKK.png',
        'https://i.imgur.com/3YxQzKR.png',
        'https://i.imgur.com/1C3LZNL.png'
      ],
      checkout: 'https://lxpay.com.br/checkout/e7c1cfe1-4971-4ffa-991d-f44be1b34488?offer=b0156aa7-54cc-47eb-b482-81534cfbf721',
    },
    {
      id: 4,
      title: 'Os Dribladores',
      price: 'R$ 74,99',
      oldPrice: 'R$ 99,99',
      discount: '25%',
      description: ['Conta perfeita pra quem gosta de firula!', 'Ney + Bruxo no mesmo time', 'Goleiro 107 de Over + Defesa impecável', '3286 de Força Coletiva'],
      images: [
        'https://i.imgur.com/4MqMA51.png',
        'https://i.imgur.com/ABBv0Yn.png',
        'https://i.imgur.com/Jrp1nEt.png',
        'https://i.imgur.com/QaKfNSp.png'
      ],
      checkout: 'https://lxpay.com.br/checkout/6b118082-acb5-41c2-999b-0eb101e1952c?offer=3e593cc4-9396-40c2-ae9c-08fcfb7a3b0d',
    },
    {
      id: 5,
      title: 'Time Full - UMA DAS MELHORES CONTAS',
      price: 'R$ 139,99',
      oldPrice: 'R$ 200,00',
      discount: '30%',
      description: ['Conta com Messi e Ibra 110', 'Gullit + Meio campo perfeito', 'Domine a partida com essa conta monstruosa', '3298 de Força Coletiva'],
      images: [
        'https://i.imgur.com/a513HQt.png',
        'https://i.imgur.com/HV7a8gj.png',
        'https://i.imgur.com/BThTm0i.png'
      ],
      checkout: 'https://lxpay.com.br/checkout/326b3d09-d159-4b54-9a6c-6477680ba97d?offer=1227ac46-b5ac-4963-b47b-c64223088abb',
    },
    {
      id: 6,
      title: 'A conta mais bizarra do jogo!',
      price: 'R$ 500,00',
      oldPrice: 'R$ 999,99',
      discount: '50%',
      description: ['A Melhor conta que você já viu!', 'Ataque perfeito', 'Messi + Gullit', '3301 de Força'],
      images: [
        'https://i.imgur.com/VuBE0hE.png',
        'https://i.imgur.com/5TAUJ8X.png',
        'https://i.imgur.com/6rnHRCE.png',
        'https://i.imgur.com/tnqJDWe.png'
      ],
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
      images: ['https://i.imgur.com/ncIXC5O.png'],
      checkout: 'https://lxpay.com.br/checkout/b2c55cde-218b-4eb1-8800-d95f5dddf12f?offer=561e33ec-a213-4201-a63e-d4e2c86f775e',
    },
    {
      id: 2,
      title: 'Melhor Ataque Console',
      price: 'R$ 79,99',
      discount: '35%',
      description: ['Melhor Ataque do Game', 'Etoo + R10', 'Defesa excelente', '3265 de Força'],
      images: ['https://i.imgur.com/NLgzU3O.png'],
      checkout: 'https://lxpay.com.br/checkout/b2c55cde-218b-4eb1-8800-d95f5dddf12f?offer=561e33ec-a213-4201-a63e-d4e2c86f775e',
    },
  ];

  const renderCard = (item: GameItem, index: number) => {
    const isExpanded = expandedCard === item.id;
    
    return (
      <div key={item.id} className="relative group" style={{ animationDelay: `${index * 50}ms` }}>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30">
          
          {/* Badge Esgotado */}
          {item.badge && (
            <div className="absolute top-3 left-3 z-20 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-white font-black text-xs tracking-wider">{item.badge}</span>
            </div>
          )}
          
          {/* Imagem - Clicável */}
          <div 
            onClick={() => openDetails(item)}
            className="relative h-44 bg-gradient-to-br from-purple-950/50 to-pink-950/50 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* Conteúdo */}
          <div className="p-4 space-y-3">
            <h3 
              onClick={() => toggleCard(item.id)}
              className="text-white font-black text-sm uppercase tracking-wide leading-tight cursor-pointer hover:text-purple-300 transition-colors"
            >
              {item.title}
            </h3>
            
            {/* Descrição expandível */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-2 mb-3 pt-2 border-t border-purple-500/20">
                {item.description.map((desc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-purple-200 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-1"></div>
                    <span className="leading-relaxed">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Preços */}
            <div className="flex items-center gap-2">
              <div>
                {item.oldPrice && (
                  <p className="text-purple-300/60 line-through text-xs font-semibold">{item.oldPrice}</p>
                )}
                <p className="text-white font-black text-xl">{item.price}</p>
                <p className="text-purple-200/70 text-[10px]">À vista no PIX</p>
              </div>
              
              {/* Badge de desconto */}
              <div className="ml-auto flex items-center gap-1 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                <TrendingDown size={12} className="text-white" />
                <span className="text-white font-black text-xs">{item.discount}</span>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-2">
              <button
                onClick={() => openDetails(item)}
                className="w-full bg-purple-700/30 hover:bg-purple-700/50 text-purple-200 py-2 rounded-xl font-bold text-xs text-center transition-all border border-purple-500/30"
              >
                Ver Detalhes
              </button>
              
              <a 
                href={item.checkout} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2.5 rounded-xl font-black text-sm text-center transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                Comprar
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Se tem item selecionado, mostra a página de detalhes
  if (selectedItem) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-pink-950/30 pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Header simplificado */}
          <header className="bg-black/80 backdrop-blur-xl border-b border-purple-500/20 py-4 px-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <button 
                onClick={closeDetails}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all"
              >
                <ArrowLeft size={20} />
                <span className="font-bold">Voltar</span>
              </button>
              
              <div className="flex items-center gap-3">
                <img src="https://i.imgur.com/ZRTzneV.png" alt="Dzn" className="w-10 h-10 rounded-xl border-2 border-purple-500/50" />
                <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dzn Store</span>
              </div>
            </div>
          </header>

          {/* Conteúdo da página de detalhes */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Galeria de Imagens */}
              <div className="space-y-4">
                {/* Imagem Principal */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-950/50 to-pink-950/50 aspect-square flex items-center justify-center p-4">
                  <img 
                    src={selectedItem.images[currentImageIndex]} 
                    alt={selectedItem.title}
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  {/* Controles de navegação */}
                  {selectedItem.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm p-3 rounded-full transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm p-3 rounded-full transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                      
                      {/* Indicador de página */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-white font-bold text-sm">
                          {currentImageIndex + 1} / {selectedItem.images.length}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Miniaturas */}
                {selectedItem.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {selectedItem.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                          currentImageIndex === idx 
                            ? 'ring-4 ring-purple-500 scale-105' 
                            : 'ring-2 ring-purple-500/20 hover:ring-purple-500/50'
                        }`}
                      >
                        <div className="aspect-square bg-gradient-to-br from-purple-950/50 to-pink-950/50">
                          <img 
                            src={img} 
                            alt={`${selectedItem.title} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações do Produto */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    {selectedItem.title}
                  </h1>
                  
                  {/* Preço */}
                  <div className="bg-purple-950/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        {selectedItem.oldPrice && (
                          <p className="text-purple-300/60 line-through text-xl font-semibold mb-2">
                            {selectedItem.oldPrice}
                          </p>
                        )}
                        <p className="text-white font-black text-5xl mb-2">{selectedItem.price}</p>
                        <p className="text-purple-200/80 text-base">À vista no PIX</p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-sm px-5 py-3 rounded-xl">
                        <TrendingDown size={24} className="text-white" />
                        <span className="text-white font-black text-2xl">{selectedItem.discount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div className="bg-purple-950/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-2xl font-black text-purple-300 mb-4">Características</h3>
                  <div className="space-y-3">
                    {selectedItem.description.map((desc, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-purple-100">
                        <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0 mt-2"></div>
                        <span className="text-lg leading-relaxed">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão de Compra */}
                <a 
                  href={selectedItem.checkout} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-5 rounded-2xl font-black text-xl text-center transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50"
                >
                  🛒 Comprar Agora
                </a>

                {/* Informações adicionais */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-950/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-center">
                    <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-purple-200">Conta Segura</p>
                  </div>
                  <div className="bg-purple-950/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-center">
                    <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-purple-200">Entrega Imediata</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Página principal (grid de produtos)
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-pink-950/30 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-xl border-b border-purple-500/20 py-3 px-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="https://i.imgur.com/ZRTzneV.png" alt="Dzn" className="w-10 h-10 rounded-xl border-2 border-purple-500/50" />
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
        <section className="py-6 text-center">
          <div className="mb-6">
            <img src="https://i.imgur.com/BgCfgxK.png" alt="Banner" className="w-full object-cover" />
          </div>
          
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-black mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {activeSection === 'mobile' ? 'Contas Mobile' : 'Contas Console'}
            </h1>
            <p className="text-purple-200 mb-4 font-semibold">
              🔥 CONTAS DISPONÍVEIS LOGO ABAIXO 🔥
            </p>
            
            {/* Linha vermelha separadora */}
            <div className="w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-full my-4 shadow-lg shadow-red-500/50"></div>
          </div>
        </section>

        {/* Grid de Contas */}
        <section className="px-4 pt-0 pb-8 max-w-7xl mx-auto">
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
              { icon: ShoppingCart, title: 'Como funciona a compra?', text: 'Escolha a conta que você quer comprar, clique em "comprar agora" e será direcionado para a página de pagamento. Preencha corretamente com seu nome e coloque seu Gmail, você vai receber o login da conta pelo seu gmail imediatamente após realizar o pagamento! Qualquer dúvida só mandar mensagem pro nosso suporte no Instagram @dznefootball. Todas as contas são Konami ID!' },
              { icon: Shield, title: 'Por que confiar na Dzn?', text: 'Somos o único site de eFootball verificado desde 2023, sempre buscando satisfação dos nossos clientes. Mais de 400 clientes já compraram com o nosso site!' },
              { icon: Clock, title: 'Quanto tempo para receber?', text: 'A entrega é feita em segundos após o pagamento, agilidade e segurança! Verifique sua caixa de entrada do Gmail após a compra.' },
              { icon: MessageCircle, title: 'Tem dúvidas?', text: 'Chame no Instagram! Equipe 24h online: @dznefootball' }
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
          <p className="text-purple-400 font-bold">Suporte 24H : @dznefootball</p>
        </footer>
      </div>
    </div>
  );
}