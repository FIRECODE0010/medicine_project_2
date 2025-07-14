import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mic,
  Play,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Square,
} from 'lucide-react';

interface VoiceRecorderProps {
  drugName: string;
  isRecording: boolean;
  recordedAudio: string | null;
  isPlayingRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void; // we will override this with our internal handler
  onRetakeRecording: () => void;
  onSubmitRecording: () => void;
  onBack: () => void;
  recordingAudioRef: React.RefObject<HTMLAudioElement>;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  drugName,
  isRecording,
  recordedAudio,
  isPlayingRecording,
  onStartRecording,
  onStopRecording,
  // Remove the external onPlayRecording and use internal handler for iOS fixes
  onRetakeRecording,
  onSubmitRecording,
  onBack,
  recordingAudioRef,
}) => {
  const handleRecordClick = () => {
    if (!isRecording) {
      onStartRecording();
    }
  };

  const handleStopClick = () => {
    onStopRecording();
  };

  // Updated play handler with iOS fixes
  const handlePlayRecording = () => {
    const audioElement = recordingAudioRef.current;
    if (audioElement && recordedAudio) {
      audioElement.src = recordedAudio;
      audioElement.load();
      audioElement.play().catch((err) => {
        console.error('Playback failed:', err);
        alert('Playback failed. Please tap the play button again.');
      });
    }
  };

  return (
    <>
      <CardHeader className='text-center pb-6 px-4'>
        <div className='mx-auto w-16 h-16 bg-gradient-to-br from-red-400 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg'>
          <span className='text-2xl'>🎤</span>
        </div>
        <CardTitle className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent'>
          Record your pronunciation
        </CardTitle>
        <p className='text-ocean-600 mt-2 text-sm md:text-base'>
          Speak clearly and confidently
        </p>
      </CardHeader>

      <CardContent className='text-center space-y-6 pb-6 px-4'>
        <div className='bg-gradient-to-r from-mint-50 to-pink-50 p-4 md:p-6 rounded-2xl border border-mint-200'>
          <p className='text-ocean-700 text-lg md:text-xl leading-relaxed'>
            Press the microphone and clearly say{' '}
            <span className='font-bold text-xl md:text-2xl bg-gradient-to-r from-mint-600 to-pink-600 bg-clip-text text-transparent block mt-2'>
              "{drugName}"
            </span>
          </p>
        </div>

        <div className='flex flex-col items-center space-y-6'>
          {!isRecording && !recordedAudio && (
            <Button
              onClick={handleRecordClick}
              className='w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-mint-300'
            >
              <div className='flex flex-col items-center'>
                <Mic className='w-10 h-10 md:w-12 md:h-12 mb-1' />
                Record
              </div>
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={handleStopClick}
              className='w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-red-300'
            >
              <div className='flex flex-col items-center'>
                <Square className='w-10 h-10 md:w-12 md:h-12 mb-1' />
                Stop
              </div>
            </Button>
          )}

          {recordedAudio && !isRecording && (
            <>
              <Button
                onClick={handlePlayRecording}
                className='w-full max-w-xs rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 text-lg font-medium shadow-md hover:scale-105 transition-all'
              >
                <Play className='mr-2 w-5 h-5' />
                {isPlayingRecording ? 'Playing...' : 'Play Recording'}
              </Button>

              <div className='flex gap-4'>
                <Button
                  onClick={onRetakeRecording}
                  className='flex-1 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 text-lg font-medium shadow-md hover:scale-105 transition-all'
                >
                  <RotateCcw className='mr-2 w-5 h-5' />
                  Retake
                </Button>

                <Button
                  onClick={onSubmitRecording}
                  className='flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white py-3 text-lg font-medium shadow-md hover:scale-105 transition-all'
                >
                  Submit
                </Button>
              </div>
            </>
          )}
        </div>

        <div className='flex justify-between pt-4'>
          <Button
            onClick={onBack}
            className='rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 py-2 px-4 text-sm md:text-base font-medium shadow hover:scale-105 transition-all'
          >
            <ArrowLeft className='w-4 h-4 mr-1' /> Back
          </Button>

          <Button
            onClick={onSubmitRecording}
            disabled={!recordedAudio}
            className={`rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 text-sm md:text-base font-medium shadow hover:scale-105 transition-all ${
              !recordedAudio ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next <ArrowRight className='w-4 h-4 ml-1' />
          </Button>
        </div>

        {/* Add controls for debugging on iPhone */}
        <audio ref={recordingAudioRef} hidden controls preload='auto' />
      </CardContent>
    </>
  );
};

export default VoiceRecorder;
