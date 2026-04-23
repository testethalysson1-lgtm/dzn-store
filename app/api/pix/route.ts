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
      return NextResponse.json(pixData);
    }

    if (action === 'check_status') {
      const statusRes = await fetch(`${API_URL}/transactions/${payload.transactionId}`, {
        headers: authHeaders(),
      });
      const statusData = await safeJson(statusRes);
      return NextResponse.json(statusData);
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}