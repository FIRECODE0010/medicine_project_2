import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, ArrowLeft, ArrowRight } from 'lucide-react';

interface SampleAudioPlayerProps {
  drugName: string;
  isPlayingSample: boolean;
  onPlaySample: () => void;
  onBack: () => void;
  onNext: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const SampleAudioPlayer: React.FC<SampleAudioPlayerProps> = ({
  drugName,
  isPlayingSample,
  onPlaySample,
  onBack,
  onNext,
  audioRef,
}) => {
  return (
    <>
      <CardHeader className='text-center pb-8'>
        <div className='mx-auto w-16 h-16 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center mb-4 shadow-lg'>
          <span className='text-2xl'>🔊</span>
        </div>
        <CardTitle className='text-3xl font-bold bg-gradient-to-r from-ocean-600 to-mint-600 bg-clip-text text-transparent'>
          Listen to the sample
        </CardTitle>
        <p className='text-ocean-600 mt-2'>Learn the correct pronunciation</p>
      </CardHeader>
      <CardContent className='text-center space-y-8'>
        <div className='bg-gradient-to-r from-mint-50 to-ocean-50 p-6 rounded-2xl border border-mint-200'>
          <p className='text-ocean-700 text-xl leading-relaxed'>
            Before recording, listen to how{' '}
            <span className='font-bold text-2xl bg-gradient-to-r from-mint-600 to-ocean-600 bg-clip-text text-transparent'>
              "{drugName}"
            </span>{' '}
            should be pronounced.
          </p>
        </div>

        <audio ref={audioRef} src={`/voice_samples/${drugName}.mp3`} hidden />

        <div className='flex justify-center'>
          <Button
            onClick={onPlaySample}
            disabled={isPlayingSample}
            className={`w-24 h-24 rounded-full text-white text-lg font-bold shadow-xl transition-all duration-300 ${
              isPlayingSample
                ? 'bg-gradient-to-r from-orange-400 to-orange-600 animate-pulse'
                : 'bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700 hover:scale-110'
            }`}
          >
            {isPlayingSample ? (
              <Pause className='w-8 h-8' />
            ) : (
              <Play className='w-8 h-8 ml-1' />
            )}
          </Button>
        </div>

        {isPlayingSample && (
          <div className='animate-fade-in'>
            <p className='text-ocean-600 font-medium text-lg'>
              🎵 Playing sample pronunciation...
            </p>
          </div>
        )}

        <div className='flex gap-6 justify-center pt-4'>
          <Button
            variant='outline'
            onClick={onBack}
            className='h-12 px-6 border-2 border-mint-200 text-mint-700 hover:bg-mint-50 hover:border-mint-300 rounded-xl font-semibold transition-all duration-300 hover:shadow-md'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Back
          </Button>
          <Button
            onClick={onNext}
            className='h-12 px-6 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
          >
            Ready to Record
            <ArrowRight className='w-5 h-5 ml-2' />
          </Button>
        </div>
      </CardContent>
    </>
  );
};

export default SampleAudioPlayer;
