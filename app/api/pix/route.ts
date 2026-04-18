import { NextRequest, NextResponse } from 'next/server';

const SIGILOPAY_PUBLIC_KEY = 'efootballsuporte_xhyjbywrmjutl9tj';
const SIGILOPAY_API_URL = 'https://app.sigilopay.com.br/api/v1';

// POST /api/pix → cria transação PIX
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${SIGILOPAY_API_URL}/gateway/pix/receive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': SIGILOPAY_PUBLIC_KEY,
      },
      body: JSON.stringify({
        identifier: `order_${Date.now()}`,
        amount: body.amount,
        client: body.client,
        products: body.products,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/pix?id=TRANSACTION_ID → consulta status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não informado' }, { status: 400 });
    }

    const res = await fetch(`${SIGILOPAY_API_URL}/gateway/transactions/${id}`, {
      headers: {
        'x-public-key': SIGILOPAY_PUBLIC_KEY,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
