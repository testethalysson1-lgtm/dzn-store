import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_KEY = 'efootballsuporte_xhyjbywrmjutl9tj';
const SECRET_KEY = 'zy5f8qn6gkrk11p0bvfaq0shzy6gm7g8cffno41kbgt5nwggr1tzwhx6q6hxd9ig';
const API_URL = 'https://app.sigilopay.com.br/api/v1/gateway';

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`API retornou resposta inválida: ${text}`);
  }
}

const authHeaders = () => ({
  'x-public-key': PUBLIC_KEY,
  'x-secret-key': SECRET_KEY,
  'Content-Type': 'application/json',
});

// Armazena pagamentos confirmados em memória (dura enquanto o servidor estiver ativo)
const paidTransactions = new Set<string>();

// GET - recebe webhook da SigiloPay
export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, payload } = body;

  // Webhook da SigiloPay — chamado automaticamente quando o PIX é pago
  if (!action) {
    console.log('WEBHOOK RECEBIDO:', JSON.stringify(body, null, 2));
    const status = body.status || body.data?.status || '';
    const id = body.transactionId || body.id || body.data?.id || body.data?.transactionId || '';
    const clientIdentifier = body.clientIdentifier || body.data?.clientIdentifier || '';

    if (['COMPLETED', 'PAID', 'paid', 'completed', 'APPROVED'].includes(status)) {
      if (id) paidTransactions.add(id);
      if (clientIdentifier) paidTransactions.add(clientIdentifier);
      console.log('PAGAMENTO CONFIRMADO VIA WEBHOOK:', id, clientIdentifier);
    }

    return NextResponse.json({ received: true });
  }

  try {
    if (action === 'create_pix') {
      // Monta a URL do webhook apontando para essa mesma rota
      const webhookUrl = 'https://dzn-storeefb.vercel.app/api/pix';

      const pixRes = await fetch(`${API_URL}/pix/receive`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          identifier: payload.identifier,
          amount: payload.amount,
          webhookUrl,
          client: {
            name: payload.client.name,
            email: payload.client.email,
            phone: payload.client.phone,
            document: payload.client.document,
          },
          dueDate: payload.dueDate,
        }),
      });
      const pixData = await safeJson(pixRes);
      console.log('CRIAR PIX:', JSON.stringify(pixData, null, 2));
      return NextResponse.json({
        ...pixData,
        _identifier: payload.identifier,
        _orderId: pixData.order?.id || pixData.orderId || '',
      });
    }

    if (action === 'check_status') {
      const { transactionId, identifier, orderId } = payload;

      // Verifica se já recebemos confirmação via webhook
      if (
        (transactionId && paidTransactions.has(transactionId)) ||
        (identifier && paidTransactions.has(identifier)) ||
        (orderId && paidTransactions.has(orderId))
      ) {
        return NextResponse.json({ status: 'PAID' });
      }

      // Fallback: consulta direta na API
      const attempts = [
        transactionId ? `${API_URL}/transactions?id=${transactionId}` : null,
        orderId ? `${API_URL}/transactions?id=${orderId}` : null,
        identifier ? `${API_URL}/transactions?clientIdentifier=${identifier}` : null,
      ].filter(Boolean) as string[];

      for (const url of attempts) {
        try {
          const res = await fetch(url, { method: 'GET', headers: authHeaders() });
          if (!res.ok) continue;
          const data = await safeJson(res);
          console.log('CHECK STATUS:', url, data.status);

          if (['COMPLETED', 'PAID', 'paid', 'completed', 'APPROVED'].includes(data.status)) {
            if (transactionId) paidTransactions.add(transactionId);
            if (identifier) paidTransactions.add(identifier);
            return NextResponse.json({ status: 'PAID', raw: data });
          }

          return NextResponse.json({ status: data.status || 'PENDING', raw: data });
        } catch {
          continue;
        }
      }

      return NextResponse.json({ status: 'PENDING' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (e: any) {
    console.error('ERRO API PIX:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
