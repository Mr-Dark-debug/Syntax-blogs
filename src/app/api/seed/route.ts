import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-data';

// POST to seed the database
export async function POST(request: NextRequest) {
  try {
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({ message: 'Database seeded successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to seed database', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
