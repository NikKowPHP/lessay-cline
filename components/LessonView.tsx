import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/stores/app-state';
import { generateLesson, getNextExercise } from '@/lib/lessons';
import { aiService } from '@/lib/ai-service';
import { Button, ProgressBar, Card, Textarea } from '@/components/ui';

const LessonView: React.FC = () => {
  const user = useStore((state) => state.user);
  const setLesson = useStore((state) => state.setLesson);
  const setExercise = useStore((state) => state.setExercise);
  const lesson = useStore((state) => state.lesson);
  const exercise = useStore((state) => state.exercise);

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    if (user) {
      loadLesson();
    }
  }, [user]);

  const loadLesson = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const newLesson = await generateLesson(user.id);
      setLesson(newLesson);
      setExercise(newLesson.exercises[0]);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextExercise = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const next = await getNextExercise(user.id);
      if (next) {
        setExercise(next);
      } else {
        alert('Congratulations! You have completed all exercises.');
      }
    } catch (error) {
      console.error('Error loading next exercise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      const buffer = await blob.arrayBuffer();
      const audioData = new Uint8Array(buffer);

      const transcript = await aiService.speechToText(audioData);
      const feedback = await aiService.analyzeProgress({
        transcript,
        exercise: exercise.content,
      });

      setFeedback(feedback);
    };

    setMediaRecorder(recorder);
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!lesson) return <div>No lesson available</div>;

  return (
    <Card>
      <h1>Lesson: {lesson.title}</h1>
      <p>{lesson.content}</p>

      <h2>Current Exercise</h2>
      <p>{exercise.content}</p>

      <div className="controls">
        <Button onClick={nextExercise} disabled={isLoading}>
          Next Exercise
        </Button>

        <Button onClick={recording ? stopRecording : startRecording} disabled={isLoading}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      {feedback && (
        <div className="feedback">
          <h3>Feedback</h3>
          <p>{feedback}</p>
        </div>
      )}

      <ProgressBar value={lesson.progress || 0} />
    </Card>
  );
};

export default LessonView;