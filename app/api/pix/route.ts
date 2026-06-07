import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_KEY = 'efootballsuporte_xhyjbywrmjutl9tj';
const SECRET_KEY = 'zy5f8qn6gkrk11p0bvfaq0shzy6gm7g8cffno41kbgt5nwggr1tzwhx6q6hxd9ig';
const API_URL = 'https://app.sigilopay.com.br/api/v1/gateway';

async function safeJson(res: Response) {
  const text = await res.text();
  console.log('RAW RESPONSE:', text);
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

const PAID = ['COMPLETED', 'PAID', 'paid', 'completed', 'APPROVED', 'approved'];

async function fetchStatus(id: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/transactions?id=${id}`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const data = await safeJson(res);
    console.log(`STATUS para id=${id}:`, JSON.stringify(data, null, 2));
    return data;
  } catch {
    return null;
  }
}

async function fetchStatusByIdentifier(identifier: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/transactions?clientIdentifier=${identifier}`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const data = await safeJson(res);
    console.log(`STATUS para identifier=${identifier}:`, JSON.stringify(data, null, 2));
    return data;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, payload } = body;

  try {
    if (action === 'create_pix') {
      const pixRes = await fetch(`${API_URL}/pix/receive`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          identifier: payload.identifier,
          amount: payload.amount,
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
        // Expõe o orderId também para usar no check
        _orderId: pixData.order?.id || pixData.orderId || '',
      });
    }

    if (action === 'check_status') {
      const { transactionId, identifier, orderId } = payload;

      let found: any = null;

      // 1. Tenta pelo transactionId
      if (transactionId) {
        found = await fetchStatus(transactionId);
        if (found && PAID.includes(found.status)) {
          return NextResponse.json({ status: 'PAID', raw: found });
        }
      }

      // 2. Tenta pelo orderId (order.id retornado na criação)
      if (orderId && orderId !== transactionId) {
        const d = await fetchStatus(orderId);
        if (d) {
          found = d;
          if (PAID.includes(d.status)) {
            return NextResponse.json({ status: 'PAID', raw: d });
          }
        }
      }

      // 3. Tenta pelo clientIdentifier
      if (identifier) {
        const d = await fetchStatusByIdentifier(identifier);
        if (d) {
          found = d;
          if (PAID.includes(d.status)) {
            return NextResponse.json({ status: 'PAID', raw: d });
          }
        }
      }

      const rawStatus = found?.status || 'PENDING';
      return NextResponse.json({ status: rawStatus, raw: found });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (e: any) {
    console.error('ERRO API PIX:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
