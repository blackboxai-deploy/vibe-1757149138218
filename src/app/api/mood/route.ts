import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const moodEntry = await request.json();

    // Validate mood entry data
    const requiredFields = ['date', 'mood', 'energy', 'sleep', 'userId'];
    for (const field of requiredFields) {
      if (moodEntry[field] === undefined || moodEntry[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate rating ranges (1-10)
    const ratings = ['mood', 'energy', 'sleep', 'anxiety', 'stress'];
    for (const rating of ratings) {
      if (moodEntry[rating] !== undefined) {
        const value = moodEntry[rating];
        if (typeof value !== 'number' || value < 1 || value > 10) {
          return NextResponse.json(
            { error: `${rating} must be a number between 1 and 10` },
            { status: 400 }
          );
        }
      }
    }

    // Create mood entry with ID and timestamp
    const entry = {
      id: `mood_${Date.now()}`,
      ...moodEntry,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In production, this would be saved to a database
    // For demo purposes, we simulate saving and return the entry

    return NextResponse.json({
      success: true,
      entry,
      message: 'Mood entry saved successfully'
    });

  } catch (error) {
    console.error('Mood entry save error:', error);
    return NextResponse.json(
      { error: 'Failed to save mood entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In production, this would fetch from database with date filtering
    // For demo, return sample mood entries
    const sampleEntries = generateSampleMoodEntries(userId, startDate, endDate);

    return NextResponse.json({
      success: true,
      entries: sampleEntries,
      count: sampleEntries.length
    });

  } catch (error) {
    console.error('Mood entries fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood entries' },
      { status: 500 }
    );
  }
}

function generateSampleMoodEntries(userId: string, startDate?: string | null, endDate?: string | null) {
  const entries = [];
  const today = new Date();
  const daysToGenerate = 30;

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Skip weekends occasionally for more realistic data
    if (Math.random() < 0.1 && (date.getDay() === 0 || date.getDay() === 6)) {
      continue;
    }

    const entry = {
      id: `mood_${date.getTime()}`,
      date: date.toISOString().split('T')[0],
      mood: Math.floor(Math.random() * 4) + 5 + Math.sin(i * 0.2) * 2, // 3-9 range with variation
      energy: Math.floor(Math.random() * 4) + 4 + Math.cos(i * 0.15) * 2, // 2-8 range
      sleep: Math.floor(Math.random() * 3) + 6 + Math.sin(i * 0.1) * 1, // 5-9 range
      anxiety: Math.floor(Math.random() * 3) + 3 + Math.cos(i * 0.25) * 1.5, // 2-6 range
      stress: Math.floor(Math.random() * 3) + 4 + Math.sin(i * 0.3) * 1.5, // 3-7 range
      activities: getRandomActivities(),
      notes: i % 5 === 0 ? getSampleNote() : '',
      userId,
      createdAt: date,
      updatedAt: date
    };

    // Ensure values stay within valid ranges
    entry.mood = Math.max(1, Math.min(10, Math.round(entry.mood)));
    entry.energy = Math.max(1, Math.min(10, Math.round(entry.energy)));
    entry.sleep = Math.max(1, Math.min(10, Math.round(entry.sleep)));
    entry.anxiety = Math.max(1, Math.min(10, Math.round(entry.anxiety)));
    entry.stress = Math.max(1, Math.min(10, Math.round(entry.stress)));

    entries.push(entry);
  }

  return entries.reverse(); // Return chronological order
}

function getRandomActivities() {
  const allActivities = [
    'Exercise', 'Meditation', 'Social time', 'Work/Study', 'Hobbies',
    'Nature/Outdoors', 'Reading', 'Music', 'Cooking', 'Rest'
  ];
  
  const numActivities = Math.floor(Math.random() * 4) + 1; // 1-4 activities
  const shuffled = allActivities.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numActivities);
}

function getSampleNote() {
  const sampleNotes = [
    'Had a great day with friends. Feeling grateful.',
    'Work was stressful but managed it well with deep breathing.',
    'Tried a new recipe today. Small wins matter!',
    'Feeling a bit overwhelmed but taking it one step at a time.',
    'Beautiful weather today. Spent time outside and it helped my mood.',
    'Meditation session this morning really set a positive tone.',
    'Challenging day but proud of how I handled it.',
    'Focusing on self-care today. Read a good book.',
    'Had an honest conversation with a friend. Feeling supported.',
    'Taking things slow today. That\'s okay too.'
  ];
  
  return sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
}