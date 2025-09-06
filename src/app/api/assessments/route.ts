import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, responses, score, userId } = await request.json();

    // Validate assessment data
    if (!type || !responses || score === undefined || !userId) {
      return NextResponse.json(
        { error: 'Missing required assessment data' },
        { status: 400 }
      );
    }

    // Validate assessment type
    const validTypes = ['PHQ-9', 'GAD-7', 'wellness'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid assessment type' },
        { status: 400 }
      );
    }

    // Create assessment record
    const assessment = {
      id: `assessment_${Date.now()}`,
      type,
      responses,
      score,
      userId,
      completedAt: new Date(),
      interpretation: getAssessmentInterpretation(type, score)
    };

    // In production, this would be saved to a database
    // For demo purposes, we simulate saving and return the assessment

    return NextResponse.json({
      success: true,
      assessment,
      message: 'Assessment saved successfully'
    });

  } catch (error) {
    console.error('Assessment save error:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In production, this would fetch from database
    // For demo, return sample assessment history
    const sampleAssessments = [
      {
        id: 'assessment_1',
        type: 'PHQ-9',
        score: 7,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        interpretation: { level: 'Mild Depression', recommendation: 'Monitor symptoms' }
      },
      {
        id: 'assessment_2', 
        type: 'GAD-7',
        score: 5,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        interpretation: { level: 'Mild Anxiety', recommendation: 'Consider stress management' }
      }
    ];

    const filteredAssessments = type 
      ? sampleAssessments.filter(a => a.type === type)
      : sampleAssessments;

    return NextResponse.json({
      success: true,
      assessments: filteredAssessments
    });

  } catch (error) {
    console.error('Assessment fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

function getAssessmentInterpretation(type: string, score: number) {
  if (type === 'PHQ-9') {
    if (score <= 4) return { level: 'Minimal Depression', recommendation: 'Continue healthy habits' };
    if (score <= 9) return { level: 'Mild Depression', recommendation: 'Monitor symptoms' };
    if (score <= 14) return { level: 'Moderate Depression', recommendation: 'Consider professional help' };
    if (score <= 19) return { level: 'Moderately Severe Depression', recommendation: 'Seek professional treatment' };
    return { level: 'Severe Depression', recommendation: 'Seek immediate professional help' };
  }

  if (type === 'GAD-7') {
    if (score <= 4) return { level: 'Minimal Anxiety', recommendation: 'Continue healthy habits' };
    if (score <= 9) return { level: 'Mild Anxiety', recommendation: 'Consider stress management' };
    if (score <= 14) return { level: 'Moderate Anxiety', recommendation: 'Consider professional help' };
    return { level: 'Severe Anxiety', recommendation: 'Seek professional help' };
  }

  return { level: 'Assessment Complete', recommendation: 'Review results with healthcare provider' };
}