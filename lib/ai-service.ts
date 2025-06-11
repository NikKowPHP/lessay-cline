export async function generateLessonForUser() {
  console.log('AI Service: Generating lesson for user');
  return { lessonId: 'demo_lesson', content: 'This is a demo lesson' };
}

export async function analyzeAudioForDiagnostics() {
  console.log('AI Service: Analyzing audio');
  return { fluencyScore: 85, pronunciationAccuracy: 90 };
}