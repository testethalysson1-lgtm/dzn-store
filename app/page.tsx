'use client';

import { useState } from 'react';
import { Menu, X, ShoppingCart, Star, Shield, Clock, MessageCircle, TrendingDown, ArrowLeft, ChevronLeft, ChevronRight, Copy, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

type GameItem = {
  id: number;
  title: string;
  price: string;
  priceNumber: number;
  oldPrice?: string;
  discount: string;
  description: string[];
  images: string[];
  checkout: string;
  badge?: string;
};

type PaymentStatus = 'idle' | 'loading' | 'pix_generated' | 'checking' | 'paid' | 'error';

type PixData = {
  code: string;
  base64?: string;
  image?: string;
  transactionId: string;
};

type CustomerForm = {
  name: string;
  phone: string;
};

async function createPixTransaction(item: GameItem, customer: CustomerForm): Promise<PixData> {
  const identifier = `dzn_${Date.now()}_${item.id}`;
  const fakeEmail = `cliente${Date.now()}@dzn.com`;
  const fakeDoc = '12345678909';

  const res = await fetch('/api/pix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create_pix',
      payload: {
        identifier,
        amount: item.priceNumber,
        client: {
          name: customer.name || 'Cliente',
          email: fakeEmail,
          phone: customer.phone || '11999999999',
          document: fakeDoc,
        },
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    }),
  });

  const data = await res.json();
  console.log('RESPOSTA SIGILOPAY:', JSON.stringify(data));

  if (data.error) throw new Error(data.error);
  if (data.errorCode) throw new Error(data.message || 'Erro na API');

  return {
    transactionId: data.transactionId || identifier,
    code: data.pix?.code || '',
    base64: data.pix?.base64 || '',
    image: data.pix?.image || '',
  };
}

async function checkPaymentStatus(transactionId: string): Promise<string> {
  const res = await fetch('/api/pix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'check_status', payload: { transactionId } }),
  });
  const data = await res.json();
  return data.status || 'PENDING';
}

function PixModal({ item, onClose }: { item: GameItem; onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'pix'>('form');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState<CustomerForm>({ name: '', phone: '' });

  const handleChange = (field: keyof CustomerForm, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
    return v;
  };

  const handleSubmit = async () => {
    if (!customer.name) {
      setError('Preencha seu nome ou apelido.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      const pix = await createPixTransaction(item, customer);
      setPixData(pix);
      setStatus('pix_generated');
      setStep('pix');
      startPolling(pix.transactionId);
    } catch (e: any) {
      setStatus('error');
      setError(e.message || 'Erro ao gerar PIX. Tente novamente.');
    }
  };

  const startPolling = (txId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        setStatus('checking');
        const s = await checkPaymentStatus(txId);
        if (['COMPLETED', 'PAID', 'paid', 'completed', 'OK'].includes(s)) {
          setStatus('paid');
          clearInterval(interval);
          setTimeout(() => {
            window.location.href = 'https://segurancatx.netlify.app/';
          }, 2000);
        } else {
          setStatus('pix_generated');
        }
      } catch {
        setStatus('pix_generated');
      }
      if (attempts >= 60) clearInterval(interval);
    }, 10000);
  };

  const copyCode = () => {
    if (pixData?.code) {
      navigator.clipboard.writeText(pixData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const getQrSrc = () => {
    if (!pixData) return '';
    if (pixData.base64) return pixData.base64;
    if (pixData.image) return pixData.image;
    if (pixData.code) return `https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(pixData.code)}`;
    return '';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-[#0d0d1a] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-purple-500/20">
          <div>
            <h2 className="text-white font-black text-lg">Pagar via PIX</h2>
            <p className="text-purple-300 text-sm font-semibold">{item.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-xl">{item.price}</span>
            <button onClick={onClose} className="p-2 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 transition-all">
              <X size={18} className="text-purple-300" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {step === 'form' && (
            <>
              <p className="text-purple-200/70 text-sm">Preencha seus dados para gerar o PIX:</p>
              <div className="space-y-3">
                <div>
                  <label className="text-purple-300 text-xs font-bold uppercase tracking-wide mb-1 block">Nome ou Apelido *</label>
                  <input type="text" value={customer.name} onChange={e => handleChange('name', e.target.value)} placeholder="Ex: João"
                    className="w-full bg-purple-950/40 border border-purple-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-purple-400/40 focus:outline-none focus:border-purple-500/60 transition-all" />
                </div>
                <div>
                  <label className="text-purple-300 text-xs font-bold uppercase tracking-wide mb-1 block">Telefone (opcional)</label>
                  <input type="text" value={customer.phone} onChange={e => handleChange('phone', formatPhone(e.target.value))} placeholder="(11) 9 9999-9999" maxLength={16}
                    className="w-full bg-purple-950/40 border border-purple-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-purple-400/40 focus:outline-none focus:border-purple-500/60 transition-all" />
                </div>
              </div>

              {(status === 'error' || error) && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button onClick={handleSubmit} disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white py-4 rounded-xl font-black text-base transition-all flex items-center justify-center gap-2">
                {status === 'loading' ? <><Loader2 size={20} className="animate-spin" />Gerando PIX...</> : 'Gerar PIX'}
              </button>
            </>
          )}

          {step === 'pix' && pixData && (
            <>
              {status === 'paid' ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={48} className="text-green-400" />
                  </div>
                  <h3 className="text-white font-black text-2xl">Pagamento Confirmado!</h3>
                  <p className="text-green-300 font-semibold">Seu pedido foi processado com sucesso.</p>
                  <p className="text-purple-200/60 text-sm">Redirecionando para receber sua conta...</p>
                  <Loader2 size={24} className="animate-spin text-purple-400 mx-auto" />
                </div>
              ) : (
                <>
                  <div className="text-center space-y-1">
                    <p className="text-purple-200/80 text-sm">Escaneie o QR Code ou copie o código PIX abaixo</p>
                    {status === 'checking' && (
                      <p className="text-yellow-400 text-xs flex items-center justify-center gap-1">
                        <Loader2 size={12} className="animate-spin" /> Verificando pagamento...
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-2xl">
                      {getQrSrc() ? (
                        <img src={getQrSrc()} alt="QR Code PIX" className="w-48 h-48" />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center text-gray-400 text-xs text-center">QR Code não disponível</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-purple-950/40 border border-purple-500/20 rounded-xl p-3 text-center">
                    <p className="text-purple-300/60 text-xs mb-1">Valor a pagar</p>
                    <p className="text-white font-black text-2xl">{item.price}</p>
                    <p className="text-purple-300/50 text-xs mt-1">PIX expira em 30 minutos</p>
                  </div>

                  {pixData.code && (
                    <div className="space-y-2">
                      <p className="text-purple-300 text-xs font-bold uppercase tracking-wide">PIX Copia e Cola</p>
                      <div className="bg-purple-950/40 border border-purple-500/20 rounded-xl p-3 flex items-center gap-2">
                        <p className="text-purple-200 text-xs font-mono flex-1 break-all leading-relaxed line-clamp-2">{pixData.code}</p>
                        <button onClick={copyCode} className="flex-shrink-0 p-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg transition-all">
                          {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} className="text-purple-300" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button onClick={copyCode}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2">
                    {copied ? <><CheckCircle size={18} /> Código Copiado!</> : <><Copy size={18} /> Copiar Código PIX</>}
                  </button>

                  <p className="text-purple-300/50 text-xs text-center">Após pagar, o status será atualizado automaticamente.</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'mobile' | 'console'>('mobile');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [payingItem, setPayingItem] = useState<GameItem | null>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCard = (id: number) => setExpandedCard(expandedCard === id ? null : id);
  const openDetails = (item: GameItem) => { setSelectedItem(item); setCurrentImageIndex(0); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const closeDetails = () => { setSelectedItem(null); setCurrentImageIndex(0); };
  const nextImage = () => { if (selectedItem) setCurrentImageIndex(p => (p + 1) % selectedItem.images.length); };
  const prevImage = () => { if (selectedItem) setCurrentImageIndex(p => (p - 1 + selectedItem.images.length) % selectedItem.images.length); };

  const games: GameItem[] = [
    { id: 3, title: 'A CONTA PERFEITA PRA VOCÊ!', price: 'R$ 10,00', priceNumber: 10, oldPrice: 'R$ 85,99', discount: '80%', description: ['Neymar | Mbappe | Messi', 'Conta perfeita e custo beneficio', 'Zaga excelente', '3290 de Força Coletiva'], images: ['https://i.imgur.com/f6hyppO.jpeg','https://i.imgur.com/Y2v40eK.jpeg','https://i.imgur.com/ChkFVNG.jpeg','https://i.imgur.com/ALZNfiQ.jpeg'], checkout: '' },
    { id: 4, title: 'O Quarteto Fantástico!', price: 'R$ 15,00', priceNumber: 15, oldPrice: 'R$ 95,99', discount: '80%', description: ['Neymar | Pelé | Messi', 'O ataque mais fatal do game', 'Zaga excelente', '3314 de Força Coletiva'], images: ['https://i.imgur.com/MUuDNfx.png','https://i.imgur.com/2P9g9Pv.png','https://i.imgur.com/UZLuCvy.png','https://i.imgur.com/XZVNLax.png'], checkout: '' },
    { id: 5, title: 'A Cavalaria Lendária!', price: 'R$ 20,00', priceNumber: 20, oldPrice: 'R$ 99,99', discount: '80%', description: ['Conta perfeita pra quem quer massacrar o adversário!', 'Gullit dominando o meio', 'Goleiro 107 de Over + Defesa impecável', '3325 de Força Coletiva'], images: ['https://i.imgur.com/yBhtlrV.jpeg','https://i.imgur.com/mNwj40i.jpeg','https://i.imgur.com/cXPoR7f.jpeg','https://i.imgur.com/W3NKnja.jpeg','https://i.imgur.com/CHZ80bI.jpeg','https://i.imgur.com/QD6KbRZ.jpeg'], checkout: '' },
    { id: 6, title: 'Time Full - Seja Invencível', price: 'R$ 45,00', priceNumber: 45, oldPrice: 'R$ 195,00', discount: '75%', description: ['Conta com Messi e Ibra 110', 'Gullit + Meio campo perfeito', 'Domine a partida com essa conta monstruosa', '3298 de Força Coletiva'], images: ['https://i.imgur.com/a513HQt.png','https://i.imgur.com/HV7a8gj.png','https://i.imgur.com/BThTm0i.png'], checkout: '' },
    { id: 7, title: 'A conta mais Bizarra do Jogo!', price: 'R$ 75,00', priceNumber: 75, oldPrice: 'R$ 999,99', discount: '90%', description: ['A Melhor conta que você já viu!', 'Ataque perfeito', 'Messi + Gullit', '3301 de Força'], images: ['https://i.imgur.com/VuBE0hE.png','https://i.imgur.com/5TAUJ8X.png','https://i.imgur.com/6rnHRCE.png','https://i.imgur.com/tnqJDWe.png'], checkout: '' },
  ];

  const consoleGames: GameItem[] = [
    { id: 1, title: 'Conta com Messi + Pelé - CONSOLE', price: 'R$ 35,00', priceNumber: 35, oldPrice: 'R$ 75,99', discount: '50%', description: ['Conta com o novo Messi', 'Pelé + Neymar no ataque', 'R10 - O Bruxo das firulas', 'Conta perfeita pra dominar a partida', '3256 de Força Coletiva'], images: ['https://i.imgur.com/m7Clk2e.png','https://i.imgur.com/YAB6neJ.png','https://i.imgur.com/EwyWRJO.png','https://i.imgur.com/vf9SCth.png','https://i.imgur.com/gcbW42u.png'], checkout: '' },
    { id: 2, title: 'A mais Top do Console', price: 'R$ 60,00', priceNumber: 60, oldPrice: 'R$ 99,99', discount: '38%', description: ['Uma das melhores contas de console', 'Ataque + Defesa perfeitos', 'Domine o jogo com esse elenco!', '3280 de Força Coletiva'], images: ['https://i.imgur.com/b4N6zH0.png','https://i.imgur.com/pUO4URa.png','https://i.imgur.com/PPuMAIX.png','https://i.imgur.com/GsT5XAs.png','https://i.imgur.com/ljC5Jnh.png'], checkout: '' },
    { id: 3, title: 'A Braba do PS5', price: 'R$ 80,00', priceNumber: 80, oldPrice: 'R$ 119,99', discount: '38%', description: ['Uma das melhores contas do PS5', 'Ataque + Defesa perfeitos', 'Domine o jogo com esse elenco!', '3281 de Força Coletiva'], images: ['https://i.imgur.com/J9zAH1z.jpeg','https://i.imgur.com/PPDHJIh.jpeg','https://i.imgur.com/t3Pxl5w.jpeg','https://i.imgur.com/cSV2Jcz.jpeg'], checkout: '' },
  ];

  const renderCard = (item: GameItem, index: number) => {
    const isExpanded = expandedCard === item.id;
    return (
      <div key={item.id} className="relative group" style={{ animationDelay: `${index * 50}ms` }}>
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30">
          <div onClick={() => openDetails(item)} className="relative h-44 bg-gradient-to-br from-purple-950/50 to-pink-950/50 overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="p-4 space-y-3">
            <h3 onClick={() => toggleCard(item.id)} className="text-white font-black text-sm uppercase tracking-wide leading-tight cursor-pointer hover:text-purple-300 transition-colors">{item.title}</h3>
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
                {item.oldPrice && <p className="text-purple-300/60 line-through text-xs font-semibold">{item.oldPrice}</p>}
                <p className="text-white font-black text-xl">{item.price}</p>
                <p className="text-purple-200/70 text-[10px]">À vista no PIX</p>
              </div>
              <div className="ml-auto flex items-center gap-1 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                <TrendingDown size={12} className="text-white" />
                <span className="text-white font-black text-xs">{item.discount}</span>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={() => openDetails(item)} className="w-full bg-purple-700/30 hover:bg-purple-700/50 text-purple-200 py-2 rounded-xl font-bold text-xs text-center transition-all border border-purple-500/30">Ver Detalhes</button>
              <button onClick={() => setPayingItem(item)} className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2.5 rounded-xl font-black text-sm text-center transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30">Comprar via PIX</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-black text-white">
        {payingItem && <PixModal item={payingItem} onClose={() => setPayingItem(null)} />}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-pink-950/30 pointer-events-none"></div>
        <div className="relative z-10">
          <header className="bg-black/80 backdrop-blur-xl border-b border-purple-500/20 py-4 px-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <button onClick={closeDetails} className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all">
                <ArrowLeft size={20} /><span className="font-bold">Voltar</span>
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
                  <img src={selectedItem.images[currentImageIndex]} alt={selectedItem.title} className="max-w-full max-h-full object-contain" />
                  {selectedItem.images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm p-3 rounded-full transition-all"><ChevronLeft size={24} /></button>
                      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm p-3 rounded-full transition-all"><ChevronRight size={24} /></button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-white font-bold text-sm">{currentImageIndex + 1} / {selectedItem.images.length}</span>
                      </div>
                    </>
                  )}
                </div>
                {selectedItem.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {selectedItem.images.map((img, idx) => (
                      <div key={idx} onClick={() => setCurrentImageIndex(idx)} className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${currentImageIndex === idx ? 'ring-4 ring-purple-500 scale-105' : 'ring-2 ring-purple-500/20 hover:ring-purple-500/50'}`}>
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
                  <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{selectedItem.title}</h1>
                  <div className="bg-purple-950/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        {selectedItem.oldPrice && <p className="text-purple-300/60 line-through text-xl font-semibold mb-2">{selectedItem.oldPrice}</p>}
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
                <button onClick={() => setPayingItem(selectedItem)} className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-5 rounded-2xl font-black text-xl text-center transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50">
                  💚 Pagar via PIX
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {payingItem && <PixModal item={payingItem} onClose={() => setPayingItem(null)} />}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-pink-950/30 pointer-events-none"></div>
      <div className="relative z-10">
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
                <button onClick={() => { setActiveSection('mobile'); setMenuOpen(false); }} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'mobile' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-purple-900/30 text-purple-200 hover:bg-purple-900/50'}`}>📱 Mobile</button>
                <button onClick={() => { setActiveSection('console'); setMenuOpen(false); }} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'console' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-purple-900/30 text-purple-200 hover:bg-purple-900/50'}`}>🎮 Console</button>
              </div>
            </div>
          )}
        </header>

        <section className="py-6 text-center">
          <div className="mb-6">
            <img src="https://i.imgur.com/hirW2G8.png" alt="Banner" className="w-full object-cover" />
          </div>
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-black mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {activeSection === 'mobile' ? 'Contas Mobile' : 'Contas Console'}
            </h1>
            <p className="text-purple-200 mb-4 font-semibold">🔥 CONTAS DISPONÍVEIS LOGO ABAIXO 🔥</p>
            <div className="w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-full my-4 shadow-lg shadow-red-500/50"></div>
          </div>
        </section>

        <section className="px-4 pt-0 pb-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(activeSection === 'mobile' ? games : consoleGames).map(renderCard)}
          </div>
        </section>

        <section className="px-4 py-16 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: ShoppingCart, title: 'Como funciona a compra?', text: 'Escolha a conta que você se interessou e clique em "Comprar via PIX". Preencha seu nome, copie o código PIX e pague pelo seu banco. Após o pagamento, entre em contato pelo Instagram!' },
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

        <section className="px-4 py-16 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Últimas Avaliações</h2>
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
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="text-yellow-400 fill-yellow-400" size={18} />)}
                </div>
                <p className="text-purple-100/80 text-sm text-center mb-4 leading-relaxed">"{review.text}"</p>
                <p className="text-purple-300 font-black text-center">{review.name}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="bg-black/80 backdrop-blur-xl border-t border-purple-500/20 py-8 text-center px-4">
          <p className="text-purple-300/70 text-sm mb-2">© 2023 Dzn Efootball. Todos os direitos reservados.</p>
          <p className="text-purple-400 font-bold">Suporte 24H : @dznefootball</p>
        </footer>
      </div>
    </div>
  );
}