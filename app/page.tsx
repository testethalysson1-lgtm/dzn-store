'use client';

import { useState } from 'react';
import { Menu, X, ShoppingCart, Star, Shield, Clock, MessageCircle, TrendingDown, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

// =============================================
// CONFIGURAÇÃO DA SIGILOPAY
// =============================================
const SIGILOPAY_PUBLIC_KEY = 'efootballsuporte_xhyjbywrmjutl9tj';
const SIGILOPAY_API_URL = 'https://app.sigilopay.com.br/api/v1';

type GameItem = {
  id: number;
  title: string;
  price: string;
  priceNumber: number;
  oldPrice?: string;
  discount: string;
  description: string[];
  images: string[];
  badge?: string;
};

type PixData = {
  transaction_id: string;
  qrCode: string;
  image: string;
  expiresAt?: string;
};

type ModalStep = 'form' | 'pix';

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'mobile' | 'console'>('mobile');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Modal de pagamento
  const [modalItem, setModalItem] = useState<GameItem | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>('form');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'completed' | 'expired'>('waiting');
  const [toastVisible, setToastVisible] = useState(false);
  const [statusInterval, setStatusInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
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

  // ---- MODAL DE PAGAMENTO ----
  const openModal = (item: GameItem) => {
    setModalItem(item);
    setModalStep('form');
    setCustomerName('');
    setCustomerPhone('');
    setFormError('');
    setPixData(null);
    setPaymentStatus('waiting');
    if (statusInterval) clearInterval(statusInterval);
  };

  const closeModal = () => {
    setModalItem(null);
    if (statusInterval) clearInterval(statusInterval);
  };

  const gerarPix = async () => {
    if (!modalItem) return;
    if (!customerName.trim()) { setFormError('Por favor, informe seu nome.'); return; }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setFormError('Por favor, informe um telefone válido com DDD.'); return;
    }

    setFormError('');
    setLoadingPix(true);

    try {
      const res = await fetch(`/api/pix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: modalItem.priceNumber,
          currency: 'BRL',
          paymentMethod: 'PIX',
          purchaseType: 'ONCE',
          client: {
            name: customerName.trim(),
            phone: customerPhone.trim(),
          },
          items: [
            {
              productName: modalItem.title,
              price: modalItem.priceNumber,
            }
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.error || 'Erro ao gerar PIX');
      }

      const pix = data?.pixInformation;
      if (!pix?.qrCode) {
        throw new Error('PIX não retornado pela API. Tente novamente.');
      }

      setPixData({
        transaction_id: data.id,
        qrCode: pix.qrCode,
        image: pix.image || '',
        expiresAt: data.availableAt || '',
      });
      setModalStep('pix');
      setPaymentStatus('waiting');

      // Polling de status a cada 5s
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/pix?id=${data.id}`);
          const statusData = await statusRes.json();

          if (statusData.status === 'COMPLETED') {
            setPaymentStatus('completed');
            clearInterval(interval);
            setTimeout(() => {
              window.location.href = 'https://segurancatx.netlify.app/';
            }, 1500);
          } else if (statusData.status === 'FAILED' || statusData.status === 'REFUNDED') {
            setPaymentStatus('expired');
            clearInterval(interval);
          }
        } catch (_) {}
      }, 5000);

      setStatusInterval(interval);

    } catch (err: any) {
      setFormError('Erro ao gerar PIX: ' + err.message);
    }

    setLoadingPix(false);
  };

  const copiarPix = () => {
    if (!pixData) return;
    navigator.clipboard.writeText(pixData.qrCode).then(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    });
  };

  const getQRImageUrl = () => {
    if (!pixData) return '';
    // Usa imagem da API se disponível, senão gera via serviço externo
    if (pixData.image && !pixData.image.includes('wikipedia')) return pixData.image;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData.qrCode)}`;
  };

  // ---- DADOS DOS PRODUTOS ----
  const games: GameItem[] = [
    {
      id: 3,
      title: 'A CONTA PERFEITA PRA VOCÊ!',
      price: 'R$ 10,00',
      priceNumber: 10.00,
      oldPrice: 'R$ 85,99',
      discount: '80%',
      description: ['CR7 | Neymar | Messi', 'Conta perfeita e custo beneficio', 'Zaga excelente', '3271 de Força Coletiva'],
      images: [
        'https://i.imgur.com/J7WpyQz.jpeg',
        'https://i.imgur.com/HBOHusW.jpeg',
        'https://i.imgur.com/pJo51c3.jpeg',
        'https://i.imgur.com/nDzAkrT.jpeg'
      ],
    },
    {
      id: 4,
      title: 'O Quarteto Fantástico!',
      price: 'R$ 15,00',
      priceNumber: 15.00,
      oldPrice: 'R$ 95,99',
      discount: '80%',
      description: ['Neymar | Pelé | Messi', 'O ataque mais fatal do game', 'Zaga excelente', '3314 de Força Coletiva'],
      images: [
        'https://i.imgur.com/MUuDNfx.png',
        'https://i.imgur.com/2P9g9Pv.png',
        'https://i.imgur.com/UZLuCvy.png',
        'https://i.imgur.com/XZVNLax.png'
      ],
    },
    {
      id: 5,
      title: 'A Cavalaria Lendária!',
      price: 'R$ 20,00',
      priceNumber: 20.00,
      oldPrice: 'R$ 99,99',
      discount: '80%',
      description: ['Conta perfeita pra quem quer massacrar o adversário!', 'Gullit dominando o meio', 'Goleiro 107 de Over + Defesa impecável', '3325 de Força Coletiva'],
      images: [
        'https://i.imgur.com/yBhtlrV.jpeg',
        'https://i.imgur.com/mNwj40i.jpeg',
        'https://i.imgur.com/cXPoR7f.jpeg',
        'https://i.imgur.com/W3NKnja.jpeg',
        'https://i.imgur.com/CHZ80bI.jpeg',
        'https://i.imgur.com/QD6KbRZ.jpeg'
      ],
    },
    {
      id: 6,
      title: 'Time Full - Seja Invencível',
      price: 'R$ 45,00',
      priceNumber: 45.00,
      oldPrice: 'R$ 195,00',
      discount: '75%',
      description: ['Conta com Messi e Ibra 110', 'Gullit + Meio campo perfeito', 'Domine a partida com essa conta monstruosa', '3298 de Força Coletiva'],
      images: [
        'https://i.imgur.com/a513HQt.png',
        'https://i.imgur.com/HV7a8gj.png',
        'https://i.imgur.com/BThTm0i.png'
      ],
    },
    {
      id: 7,
      title: 'A conta mais Bizarra do Jogo!',
      price: 'R$ 75,00',
      priceNumber: 75.00,
      oldPrice: 'R$ 999,99',
      discount: '90%',
      description: ['A Melhor conta que você já viu!', 'Ataque perfeito', 'Messi + Gullit', '3301 de Força'],
      images: [
        'https://i.imgur.com/VuBE0hE.png',
        'https://i.imgur.com/5TAUJ8X.png',
        'https://i.imgur.com/6rnHRCE.png',
        'https://i.imgur.com/tnqJDWe.png'
      ],
    },
  ];

  const consoleGames: GameItem[] = [
    {
      id: 101,
      title: 'Conta com Messi + Pelé - CONSOLE',
      price: 'R$ 35,00',
      priceNumber: 35.00,
      oldPrice: 'R$ 75,99',
      discount: '50%',
      description: ['Conta com o novo Messi', 'Pelé + Neymar no ataque', 'R10 - O Bruxo das firulas', 'Conta perfeita pra dominar a partida', '3256 de Força Coletiva'],
      images: [
        'https://i.imgur.com/m7Clk2e.png',
        'https://i.imgur.com/YAB6neJ.png',
        'https://i.imgur.com/EwyWRJO.png',
        'https://i.imgur.com/vf9SCth.png',
        'https://i.imgur.com/gcbW42u.png'
      ],
    },
    {
      id: 102,
      title: 'A mais Top do Console',
      price: 'R$ 60,00',
      priceNumber: 60.00,
      oldPrice: 'R$ 99,99',
      discount: '38%',
      description: ['Uma das melhores contas de console', 'Ataque + Defesa perfeitos', 'Domine o jogo com esse elenco!', '3280 de Força Coletiva'],
      images: [
        'https://i.imgur.com/b4N6zH0.png',
        'https://i.imgur.com/pUO4URa.png',
        'https://i.imgur.com/PPuMAIX.png',
        'https://i.imgur.com/GsT5XAs.png',
        'https://i.imgur.com/ljC5Jnh.png'
      ],
    },
    {
      id: 103,
      title: 'A Braba do PS5',
      price: 'R$ 80,00',
      priceNumber: 80.00,
      oldPrice: 'R$ 119,99',
      discount: '38%',
      description: ['Uma das melhores contas do PS5', 'Ataque + Defesa perfeitos', 'Domine o jogo com esse elenco!', '3281 de Força Coletiva'],
      images: [
        'https://i.imgur.com/J9zAH1z.jpeg',
        'https://i.imgur.com/PPDHJIh.jpeg',
        'https://i.imgur.com/t3Pxl5w.jpeg',
        'https://i.imgur.com/cSV2Jcz.jpeg'
      ],
    },
  ];

  // ---- RENDER CARD ----
  const renderCard = (item: GameItem, index: number) => {
    const isExpanded = expandedCard === item.id;

    return (
      <div key={item.id} className="relative group" style={{ animationDelay: `${index * 50}ms` }}>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30">

          {item.badge && (
            <div className="absolute top-3 left-3 z-20 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-white font-black text-xs tracking-wider">{item.badge}</span>
            </div>
          )}

          <div
            onClick={() => openDetails(item)}
            className="relative h-44 bg-gradient-to-br from-purple-950/50 to-pink-950/50 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="p-4 space-y-3">
            <h3
              onClick={() => toggleCard(item.id)}
              className="text-white font-black text-sm uppercase tracking-wide leading-tight cursor-pointer hover:text-purple-300 transition-colors"
            >
              {item.title}
            </h3>

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

            <div className="flex items-center gap-2">
              <div>
                {item.oldPrice && (
                  <p className="text-purple-300/60 line-through text-xs font-semibold">{item.oldPrice}</p>
                )}
                <p className="text-white font-black text-xl">{item.price}</p>
                <p className="text-purple-200/70 text-[10px]">À vista no PIX</p>
              </div>
              <div className="ml-auto flex items-center gap-1 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                <TrendingDown size={12} className="text-white" />
                <span className="text-white font-black text-xs">{item.discount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => openDetails(item)}
                className="w-full bg-purple-700/30 hover:bg-purple-700/50 text-purple-200 py-2 rounded-xl font-bold text-xs text-center transition-all border border-purple-500/30"
              >
                Ver Detalhes
              </button>

              <button
                onClick={() => openModal(item)}
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2.5 rounded-xl font-black text-sm text-center transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---- PÁGINA DE DETALHES ----
  if (selectedItem) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-pink-950/30 pointer-events-none"></div>

        <div className="relative z-10">
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

          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-950/50 to-pink-950/50 aspect-square flex items-center justify-center p-4">
                  <img
                    src={selectedItem.images[currentImageIndex]}
                    alt={selectedItem.title}
                    className="max-w-full max-h-full object-contain"
                  />
                  {selectedItem.images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm p-3 rounded-full transition-all">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm p-3 rounded-full transition-all">
                        <ChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-white font-bold text-sm">{currentImageIndex + 1} / {selectedItem.images.length}</span>
                      </div>
                    </>
                  )}
                </div>

                {selectedItem.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {selectedItem.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${currentImageIndex === idx ? 'ring-4 ring-purple-500 scale-105' : 'ring-2 ring-purple-500/20 hover:ring-purple-500/50'}`}
                      >
                        <div className="aspect-square bg-gradient-to-br from-purple-950/50 to-pink-950/50">
                          <img src={img} alt={`${selectedItem.title} ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    {selectedItem.title}
                  </h1>

                  <div className="bg-purple-950/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        {selectedItem.oldPrice && (
                          <p className="text-purple-300/60 line-through text-xl font-semibold mb-2">{selectedItem.oldPrice}</p>
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

                <button
                  onClick={() => openModal(selectedItem)}
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-5 rounded-2xl font-black text-xl text-center transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50"
                >
                  🛒 Comprar Agora
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-950/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-center">
                    <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-purple-200">Compra Segura</p>
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

        {modalItem && (
          <PaymentModal
            item={modalItem}
            step={modalStep}
            customerName={customerName}
            customerPhone={customerPhone}
            formError={formError}
            loadingPix={loadingPix}
            pixData={pixData}
            paymentStatus={paymentStatus}
            toastVisible={toastVisible}
            onClose={closeModal}
            onNameChange={setCustomerName}
            onPhoneChange={setCustomerPhone}
            onGerarPix={gerarPix}
            onCopiarPix={copiarPix}
            getQRImageUrl={getQRImageUrl}
          />
        )}

        <WhatsAppButton />
      </div>
    );
  }

  // ---- PÁGINA PRINCIPAL ----
  return (
    <div className="min-h-screen bg-black text-white">
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
                <button
                  onClick={() => { setActiveSection('mobile'); setMenuOpen(false); }}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'mobile' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-purple-900/30 text-purple-200 hover:bg-purple-900/50'}`}
                >
                  📱 Mobile
                </button>
                <button
                  onClick={() => { setActiveSection('console'); setMenuOpen(false); }}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'console' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-purple-900/30 text-purple-200 hover:bg-purple-900/50'}`}
                >
                  🎮 Console
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Hero */}
        <section className="py-6 text-center">
          <div className="mb-6">
            <img src="https://i.imgur.com/hirW2G8.png" alt="Banner" className="w-full object-cover" />
          </div>

          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-black mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {activeSection === 'mobile' ? 'Contas Mobile' : 'Contas Console'}
            </h1>
            <p className="text-purple-200 mb-4 font-semibold">
              🔥 CONTAS DISPONÍVEIS LOGO ABAIXO 🔥
            </p>
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
              { icon: ShoppingCart, title: 'Como funciona a compra?', text: 'Escolha a conta que você se interessou e clique em "Comprar". Preencha seu nome, telefone e CPF, o pix vai ser gerado, realize o pagamento e aguarde. Após a confirmação, você é direcionado automaticamente para a página de acessar os dados da conta.' },
              { icon: Shield, title: 'Por que confiar na Dzn Store?', text: 'Somos o único site de eFootball verificado desde 2023, sempre buscando satisfação dos nossos clientes. Mais de 400 clientes já compraram no nosso site!' },
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

        {/* Avaliações */}
        <section className="px-4 py-16 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Últimas Avaliações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Paulo G.', text: 'Comprei a do trio MSN e o chegou rapidinho. Recomendo!' },
              { name: 'Ney Edits', text: 'Atendimento bom e a conta do Ney 107 que comprei ajuda demais pra subir divisão agora' },
              { name: 'Ronaldo Lima.', text: 'Agradeço pelo trabalho de vocês, meu filho já tinha caído em muito golpe tentando comprar conta desse jogo.' },
              { name: 'Gustavo S.', text: 'Melhor site de contas de eFootball que já comprei.' },
              { name: 'Augusto M.', text: 'Conta top chegou certinho.' },
              { name: 'Galáticos', text: 'Comprei a do CR7 com Ney e gostei muito.' },
            ].map((review, i) => (
              <div key={i} className="bg-purple-950/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="text-yellow-400 fill-yellow-400" size={18} />
                  ))}
                </div>
                <p className="text-purple-100/80 text-sm text-center mb-4 leading-relaxed">"{review.text}"</p>
                <p className="text-purple-300 font-black text-center">{review.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/80 backdrop-blur-xl border-t border-purple-500/20 py-8 text-center px-4">
          <p className="text-purple-300/70 text-sm mb-2">© 2023 Dzn Efootball. Todos os direitos reservados.</p>
          <p className="text-purple-400 font-bold">Suporte 24H : @dznefootball</p>
        </footer>
      </div>

      {/* Modal de Pagamento */}
      {modalItem && (
        <PaymentModal
          item={modalItem}
          step={modalStep}
          customerName={customerName}
          customerPhone={customerPhone}
          formError={formError}
          loadingPix={loadingPix}
          pixData={pixData}
          paymentStatus={paymentStatus}
          toastVisible={toastVisible}
          onClose={closeModal}
          onNameChange={setCustomerName}
          onPhoneChange={setCustomerPhone}
          onGerarPix={gerarPix}
          onCopiarPix={copiarPix}
          getQRImageUrl={getQRImageUrl}
        />
      )}

      <WhatsAppButton />
    </div>
  );
}

// ---- BOTÃO WHATSAPP FLUTUANTE ----
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5579991084906"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        background: '#25D366',
        boxShadow: '0 4px 24px 0 rgba(37,211,102,0.5)',
      }}
      title="Falar no WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="30" height="30" fill="white">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.663 4.61 1.81 6.51L4 29l7.697-1.787A12.94 12.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a10.94 10.94 0 0 1-5.38-1.41l-.38-.22-3.95.917.946-3.84-.24-.39A9.953 9.953 0 0 1 6 15c0-5.523 4.477-10 10-10zm-3.29 5.293c-.19 0-.499.071-.762.356-.263.285-1.002.978-1.002 2.384s1.025 2.765 1.168 2.957c.144.192 2.01 3.073 4.874 4.31.68.294 1.21.469 1.624.6.682.217 1.304.186 1.795.113.547-.082 1.687-.689 1.926-1.354.238-.665.238-1.235.167-1.354-.072-.119-.263-.19-.55-.333-.286-.143-1.688-.833-1.95-.928-.261-.095-.452-.143-.642.143-.19.285-.737.928-.904 1.12-.167.19-.334.214-.621.071-.286-.143-1.207-.445-2.3-1.42-.85-.758-1.423-1.694-1.59-1.98-.167-.285-.018-.44.125-.582.128-.128.286-.334.429-.501.143-.167.19-.285.285-.476.095-.19.048-.357-.024-.5-.071-.143-.642-1.548-.879-2.119-.23-.554-.464-.479-.642-.487-.166-.007-.357-.009-.548-.009z" />
      </svg>
    </a>
  );
}

// ---- TIPOS DO MODAL ----
type PaymentModalProps = {
  item: GameItem;
  step: ModalStep;
  customerName: string;
  customerPhone: string;
  formError: string;
  loadingPix: boolean;
  pixData: PixData | null;
  paymentStatus: 'waiting' | 'completed' | 'expired';
  toastVisible: boolean;
  onClose: () => void;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onGerarPix: () => void;
  onCopiarPix: () => void;
  getQRImageUrl: () => string;
};

// ---- COMPONENTE DO MODAL ----
function PaymentModal({
  item, step, customerName, customerPhone, formError, loadingPix,
  pixData, paymentStatus, toastVisible, onClose, onNameChange,
  onPhoneChange, onGerarPix, onCopiarPix, getQRImageUrl
}: PaymentModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-3xl p-7 max-h-[90vh] overflow-y-auto"
          style={{ background: 'linear-gradient(135deg, #1a0533, #0d0d0d, #1a0020)', border: '1px solid rgba(168,85,247,0.4)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 transition-all text-lg font-bold"
          >
            ✕
          </button>

          {/* STEP 1: Formulário */}
          {step === 'form' && (
            <div>
              <h2 className="text-xl font-black mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Finalizar Compra
              </h2>
              <p className="text-purple-300/60 text-sm mb-6">{item.price} · À vista no PIX</p>

              <div className="mb-4">
                <label className="block text-purple-300 text-sm font-bold mb-2">Nome completo</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-purple-300/40 outline-none text-sm transition-all"
                  style={{ background: 'rgba(88,28,135,0.2)', border: '1px solid rgba(168,85,247,0.3)' }}
                />
              </div>

              <div className="mb-6">
                <label className="block text-purple-300 text-sm font-bold mb-2">Telefone (WhatsApp)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  placeholder="Ex: 11999999999"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-purple-300/40 outline-none text-sm transition-all"
                  style={{ background: 'rgba(88,28,135,0.2)', border: '1px solid rgba(168,85,247,0.3)' }}
                />
              </div>

              {formError && (
                <p className="text-red-400 text-sm text-center mb-4">{formError}</p>
              )}

              <button
                onClick={onGerarPix}
                disabled={loadingPix}
                className="w-full py-4 rounded-2xl font-black text-white text-base transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(to right, #7c3aed, #db2777)' }}
              >
                {loadingPix ? '⏳ Gerando PIX...' : '⚡ Gerar PIX'}
              </button>
            </div>
          )}

          {/* STEP 2: PIX Gerado */}
          {step === 'pix' && pixData && (
            <div>
              <h2 className="text-xl font-black mb-1 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PIX Gerado! 🎉
              </h2>
              <p className="text-purple-300/60 text-sm text-center mb-5">Escaneie o QR Code ou copie o código</p>

              <div className="flex justify-center mb-5">
                <img
                  src={getQRImageUrl()}
                  alt="QR Code PIX"
                  className="w-44 h-44 rounded-xl"
                  style={{ border: '3px solid rgba(168,85,247,0.4)' }}
                />
              </div>

              <div className="text-center mb-5">
                <p className="text-white font-black text-3xl">{item.price}</p>
                <p className="text-purple-300/60 text-xs mt-1">à vista no PIX</p>
              </div>

              <p className="text-purple-300 text-xs font-bold mb-2">Código Copia e Cola:</p>
              <div
                onClick={onCopiarPix}
                className="rounded-xl p-3 cursor-pointer transition-all mb-1"
                style={{ background: 'rgba(88,28,135,0.3)', border: '1px solid rgba(168,85,247,0.4)' }}
                title="Clique para copiar"
              >
                <p className="text-purple-300 text-xs break-all leading-relaxed">{pixData.qrCode}</p>
              </div>
              <p className="text-purple-300/40 text-xs text-center mb-4">Clique no código para copiar</p>

              <button
                onClick={onCopiarPix}
                className="w-full py-3 rounded-2xl font-black text-white text-sm mb-3 transition-all transform hover:scale-105"
                style={{ background: 'linear-gradient(to right, #7c3aed, #db2777)' }}
              >
                📋 Copiar Código PIX
              </button>

              <div className="text-center mb-3">
                {paymentStatus === 'waiting' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-yellow-400 text-sm font-bold animate-pulse" style={{ background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)' }}>
                    ⏳ Aguardando pagamento...
                  </span>
                )}
                {paymentStatus === 'completed' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-green-400 text-sm font-bold" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)' }}>
                    ✅ Pagamento confirmado! Redirecionando...
                  </span>
                )}
                {paymentStatus === 'expired' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-red-400 text-sm font-bold" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
                    ❌ PIX expirado ou falhou
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-bold text-purple-200 text-sm transition-all"
                style={{ border: '1px solid rgba(168,85,247,0.3)', background: 'rgba(88,28,135,0.2)' }}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-full font-bold text-sm z-[9999] whitespace-nowrap transition-all duration-300"
        style={{
          background: 'linear-gradient(to right, #7c3aed, #db2777)',
          transform: `translateX(-50%) translateY(${toastVisible ? '0' : '100px'})`,
        }}
      >
        ✅ Código copiado!
      </div>
    </>
  );
}