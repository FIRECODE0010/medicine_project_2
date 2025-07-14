
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Sparkles } from 'lucide-react';

interface UserInfo {
  isFromPharmacy: boolean;
  pharmacyName: string;
  gender: string;
  drugName: string;
}

interface SuccessMessageProps {
  userInfo: UserInfo;
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ userInfo, onReset }) => {
  return (
    <>
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-mint-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-mint-600 bg-clip-text text-transparent mb-4">
          🎉 Thank you!
        </CardTitle>
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-mint-500" />
          <p className="text-ocean-600 text-lg">Mission accomplished</p>
          <Sparkles className="w-5 h-5 text-mint-500" />
        </div>
      </CardHeader>
      <CardContent className="text-center space-y-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-mint-50 p-6 rounded-2xl border border-green-200">
            <p className="text-2xl text-ocean-700 font-semibold mb-2">
              Your voice was recorded successfully! 🎵
            </p>
            <p className="text-mint-600 font-medium text-lg">
              You're helping us build a smarter, safer healthcare future. 💚
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h3 className="text-lg font-bold text-indigo-800 mb-4">📋 Recording Details</h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center py-2 border-b border-indigo-100">
                <span className="font-semibold text-indigo-700">💊 Drug Name:</span>
                <span className="text-indigo-600 font-medium">{userInfo.drugName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-indigo-100">
                <span className="font-semibold text-indigo-700">🏥 Affiliation:</span>
                <span className="text-indigo-600 font-medium">
                  {userInfo.isFromPharmacy ? userInfo.pharmacyName : 'Independent contributor'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-indigo-700">👤 Gender:</span>
                <span className="text-indigo-600 font-medium">{userInfo.gender}</span>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={onReset}
          className="w-full h-16 bg-gradient-to-r from-mint-500 to-ocean-500 hover:from-mint-600 hover:to-ocean-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <span className="mr-3">🎤</span>
          Record Another Drug
          <span className="ml-3">→</span>
        </Button>
      </CardContent>
    </>
  );
};

export default SuccessMessage;
