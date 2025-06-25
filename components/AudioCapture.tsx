// ROO-AUDIT-TAG :: plan-006-speech-processing.md :: Create audio capture component
import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function AudioCapture() {
  const waveformRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4f46e5',
        progressColor: '#4338ca',
        cursorWidth: 0,
        height: 80,
      });
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      source.connect(analyser);
      analyser.fftSize = 2048;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      const updateVolume = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const avg = array.reduce((a, b) => a + b) / array.length;
        setVolumeLevel(avg);
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-4">
      <div ref={waveformRef} />
      <div className="flex items-center gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"
               style={{ opacity: volumeLevel / 255 }} />
          <span className="text-sm">
            {Math.round((volumeLevel / 255) * 100)}% Volume
          </span>
        </div>
      </div>
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-006-speech-processing.md :: END