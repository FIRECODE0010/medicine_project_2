import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import UserInfoForm from './voice-collector/UserInfoForm';
import SampleAudioPlayer from './voice-collector/SampleAudioPlayer';
import VoiceRecorder from './voice-collector/VoiceRecorder';
import SuccessMessage from './voice-collector/SuccessMessage';
import ProgressSteps from './voice-collector/ProgressSteps';

import { storage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface UserInfo {
  isFromPharmacy: boolean;
  pharmacyName: string;
  gender: string;
  drugName: string;
}

type Step = 'info' | 'sample' | 'record' | 'success';

const VoiceCollector = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    isFromPharmacy: false,
    pharmacyName: '',
    gender: '',
    drugName: '',
  });
  const [countdown, setCountdown] = React.useState<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);

  const recordedAudioBlobRef = useRef<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingAudioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleInfoSubmit = () => {
    const { isFromPharmacy, pharmacyName, gender, drugName } = userInfo;
    if ((isFromPharmacy && !pharmacyName) || !gender || !drugName) {
      toast({
        title: 'Please fill in all fields',
        description: 'We need all information to proceed.',
        variant: 'destructive',
      });
      return;
    }
    setCurrentStep('sample');
  };

  const playSampleAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlayingSample(true);

      audioRef.current.onended = () => {
        setIsPlayingSample(false);
        toast({
          title: 'Sample played',
          description: `Listen carefully to how "${userInfo.drugName}" should be pronounced.`,
        });
      };

      audioRef.current.onerror = () => {
        setIsPlayingSample(false);
        toast({
          title: 'Error',
          description: 'Failed to play sample audio.',
          variant: 'destructive',
        });
      };
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/mp4',
        });
        recordedAudioBlobRef.current = audioBlob;
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach((track) => track.stop());
        setCountdown(null); // reset countdown
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setCountdown(3); // start countdown at 3 seconds
      toast({
        title: 'Recording started',
        description: `Please pronounce "${userInfo.drugName}" clearly.`,
      });

      // Countdown interval every 1 second
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(countdownInterval);
            if (mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast({
        title: 'Recording failed',
        description: 'Please allow microphone access to record your voice.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (recordedAudio && recordingAudioRef.current) {
      recordingAudioRef.current.src = recordedAudio;
      recordingAudioRef.current.play();
      setIsPlayingRecording(true);
      recordingAudioRef.current.onended = () => setIsPlayingRecording(false);
    }
  };

  const retakeRecording = () => {
    setRecordedAudio(null);
    recordedAudioBlobRef.current = null;
    if (recordingAudioRef.current) {
      recordingAudioRef.current.pause();
      recordingAudioRef.current.currentTime = 0;
    }
    setIsPlayingRecording(false);
  };

  const submitRecording = async () => {
    if (!recordedAudioBlobRef.current) {
      toast({
        title: 'No recording found',
        description: 'Please record your voice before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `audio_${timestamp}.mp4`;

    let folder = '';
    if (userInfo.isFromPharmacy && userInfo.pharmacyName.trim() !== '') {
      folder = `dataset/${userInfo.pharmacyName
        .trim()
        .toLowerCase()}/${userInfo.gender.toLowerCase()}/${userInfo.drugName.toLowerCase()}`;
    } else {
      folder = `dataset/${userInfo.gender.toLowerCase()}/${userInfo.drugName.toLowerCase()}`;
    }

    const storageRef = ref(storage, `${folder}/${filename}`);

    try {
      const uploadTask = uploadBytesResumable(
        storageRef,
        recordedAudioBlobRef.current
      );

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // Optional: progress feedback
        },
        (error) => {
          setUploading(false);
          toast({
            title: 'Upload failed',
            description: error.message,
            variant: 'destructive',
          });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          setCurrentStep('success');
          toast({
            title: 'Upload successful!',
            description: 'Your voice recording has been saved to our dataset.',
          });
          console.log('File available at', downloadURL);
        }
      );
    } catch (error: any) {
      setUploading(false);
      toast({
        title: 'Upload error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetApp = () => {
    setCurrentStep('info');
    setUserInfo({
      isFromPharmacy: false,
      pharmacyName: '',
      gender: '',
      drugName: '',
    });
    setRecordedAudio(null);
    recordedAudioBlobRef.current = null;
    setIsRecording(false);
    setIsPlayingSample(false);
    setIsPlayingRecording(false);
  };

  return (
    <div className='min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-mint-50 via-white to-ocean-50'>
      <div className='w-full max-w-2xl'>
        <div className='text-center mb-12 animate-fade-in'>
          <div className='mb-6'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-mint-400 to-ocean-600 rounded-full shadow-2xl mb-4'>
              <span className='text-3xl'>🎙️</span>
            </div>
          </div>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-mint-600 to-ocean-600 bg-clip-text text-transparent mb-4'>
            Voice Collector
          </h1>
          <p className='text-xl text-ocean-700 max-w-2xl mx-auto leading-relaxed'>
            Help us build a comprehensive dataset of drug pronunciations to
            improve healthcare communication.
          </p>
        </div>

        <ProgressSteps currentStep={currentStep} />

        <Card className='glass-card animate-fade-in shadow-2xl border-0 backdrop-blur-md bg-white/70'>
          {currentStep === 'info' && (
            <UserInfoForm
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              onSubmit={handleInfoSubmit}
            />
          )}

          {currentStep === 'sample' && (
            <SampleAudioPlayer
              drugName={userInfo.drugName}
              isPlayingSample={isPlayingSample}
              onPlaySample={playSampleAudio}
              onBack={() => setCurrentStep('info')}
              onNext={() => setCurrentStep('record')}
              audioRef={audioRef}
            />
          )}

          {currentStep === 'record' && (
            <VoiceRecorder
              drugName={userInfo.drugName}
              isRecording={isRecording}
              countdown={countdown}
              recordedAudio={recordedAudio}
              isPlayingRecording={isPlayingRecording}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onPlayRecording={playRecording}
              onRetakeRecording={retakeRecording}
              onSubmitRecording={submitRecording}
              onBack={() => setCurrentStep('sample')}
              recordingAudioRef={recordingAudioRef}
              uploading={uploading}
            />
          )}

          {currentStep === 'success' && (
            <SuccessMessage userInfo={userInfo} onReset={resetApp} />
          )}
        </Card>

        <div className='text-center mt-8 animate-fade-in'>
          <div className='flex items-center justify-center space-x-2 text-ocean-600'>
            {/*<span className='text-2xl'>🧪 </span>
              <p className='text-lg font-medium'>
              Help Us to build AI system for medicine recgontion together{' '}
            </p>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCollector;
