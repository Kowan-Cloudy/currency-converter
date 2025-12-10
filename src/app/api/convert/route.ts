import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { convertCurrency } from '@/lib/currency';

export async function POST(request: NextRequest) {
  try {
    const { amount, from, to } = await request.json();

    if (!amount || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { result, rate } = await convertCurrency(amount, from, to);

    // Save to database
    const history = await prisma.conversionHistory.create({
      data: {
        fromCurrency: from,
        toCurrency: to,
        amount: parseFloat(amount),
        result,
        rate,
      },
    });

    return NextResponse.json({
      result,
      rate,
      id: history.id,
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Conversion failed' },
      { status: 500 }
    );
  }
}
