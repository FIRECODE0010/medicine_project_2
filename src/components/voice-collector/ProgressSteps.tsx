import React from 'react';

type Step = 'info' | 'sample' | 'record' | 'success';

interface ProgressStepsProps {
  currentStep: Step;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps: { id: Step; label: string; icon: string }[] = [
    { id: 'info', label: 'Info', icon: '📝' },
    { id: 'sample', label: 'Sample', icon: '🔊' },
    { id: 'record', label: 'Record', icon: '🎤' },
    { id: 'success', label: 'Success', icon: '🎉' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className='flex justify-center mb-8 md:mb-12 px-4'>
      <div className='flex items-center space-x-2 sm:space-x-4 overflow-x-auto'>
        {steps.map((step, index) => (
          <div key={step.id} className='flex items-center flex-shrink-0'>
            <div className='flex flex-col items-center'>
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-bold transition-all duration-500 shadow-lg ${
                  currentStep === step.id
                    ? 'bg-gradient-to-r from-mint-500 to-ocean-500 text-white shadow-xl scale-100'
                    : index < currentStepIndex
                    ? 'bg-gradient-to-r from-mint-200 to-mint-300 text-mint-800 shadow-md'
                    : 'bg-gray-100 text-gray-400 shadow-sm'
                }`}
              >
                <span className='text-sm sm:text-base md:text-xl'>
                  {step.icon}
                </span>
              </div>
              <span
                className={`mt-1 sm:mt-2 text-xs sm:text-sm font-semibold transition-colors duration-300 hidden sm:block ${
                  currentStep === step.id
                    ? 'text-mint-600'
                    : index < currentStepIndex
                    ? 'text-mint-500'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < 3 && (
              <div
                className={`w-8 sm:w-12 md:w-16 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-500 ${
                  index < currentStepIndex
                    ? 'bg-gradient-to-r from-mint-300 to-mint-400 shadow-sm'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
