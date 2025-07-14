import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DRUG_NAMES = [
  'CLOPIDIGREI',
  'SIMVASTATIN',
  'CANDESARTAN',
  'METOPROLOL',
  'DESLORATADINE',
  'TERAZOSIN',
  'LISINOPRIL',
  'OMEPRAZOLE',
  'IBUPROFEN',
  'IRBESARTAN',
  'OLANZAPINE',
  'DIAZEPAM AMPULES',
  'VALSARTAN',
  'LACTULOSE',
  'SUMATRIPTAM',
  'GLIMEPIRIDE',
  'ISOSORBIDE MONONITRATE',
  'CLARITHROMYCIN',
  'SOTALOL',
  'PARACETAMOL',
];

interface UserInfo {
  isFromPharmacy: boolean;
  pharmacyName: string;
  gender: string;
  drugName: string;
}

interface UserInfoFormProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  onSubmit: () => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  userInfo,
  setUserInfo,
  onSubmit,
}) => {
  return (
    <>
      <CardHeader className='text-center pb-8'>
        <div className='mx-auto w-16 h-16 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full flex items-center justify-center mb-4 shadow-lg'>
          <span className='text-2xl'>👋</span>
        </div>
        <CardTitle className='text-3xl font-bold bg-gradient-to-r from-mint-600 to-ocean-600 bg-clip-text text-transparent'>
          Welcome! Let's get started
        </CardTitle>
        <p className='text-ocean-600 mt-2'>
          Help us build a better healthcare future
        </p>
      </CardHeader>
      <CardContent className='space-y-8'>
        <div className='space-y-4'>
          {/*<Label className='text-ocean-700 font-semibold text-lg'>
            Are you from a pharmacy?
          </Label>
          <div className='grid grid-cols-2 gap-4'>
            <Button
              variant={userInfo.isFromPharmacy === true ? 'default' : 'outline'}
              onClick={() =>
                setUserInfo((prev) => ({ ...prev, isFromPharmacy: true }))
              }
              className={`h-14 text-lg font-medium transition-all duration-300 ${
                userInfo.isFromPharmacy === true
                  ? 'bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white shadow-lg transform hover:scale-105'
                  : 'border-2 border-mint-200 text-mint-700 hover:bg-mint-50 hover:border-mint-300 hover:shadow-md'
              }`}
            >
              Yes 🏥
            </Button>
            <Button
              variant={
                userInfo.isFromPharmacy === false ? 'default' : 'outline'
              }
              onClick={() =>
                setUserInfo((prev) => ({
                  ...prev,
                  isFromPharmacy: false,
                  pharmacyName: '',
                }))
              }
              className={`h-14 text-lg font-medium transition-all duration-300 ${
                userInfo.isFromPharmacy === false
                  ? 'bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white shadow-lg transform hover:scale-105'
                  : 'border-2 border-mint-200 text-mint-700 hover:bg-mint-50 hover:border-mint-300 hover:shadow-md'
              }`}
            >
              No 👤
            </Button>
          </div> */}
        </div>
        {userInfo.isFromPharmacy && (
          <div className='space-y-3 animate-fade-in'>
            <Label
              htmlFor='pharmacy'
              className='text-ocean-700 font-semibold text-lg'
            >
              Pharmacy Name
            </Label>
            <Input
              id='pharmacy'
              placeholder='e.g., Green Life Pharmacy'
              value={userInfo.pharmacyName}
              onChange={(e) =>
                setUserInfo((prev) => ({
                  ...prev,
                  pharmacyName: e.target.value,
                }))
              }
              className='h-12 text-lg border-2 border-blue-300 focus:border-blue-400 focus:ring-mint-400 rounded-xl placeholder:text-black bg-blue-50 hover:bg-blue-100 transition-all'
            />
          </div>
        )}
        <div className='space-y-3'>
          <Label
            htmlFor='gender'
            className='text-ocean-700 font-semibold text-lg'
          >
            Gender
          </Label>
          <Select
            value={userInfo.gender}
            onValueChange={(value) =>
              setUserInfo((prev) => ({ ...prev, gender: value }))
            }
          >
            <SelectTrigger className='h-12 text-lg border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-400 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300'>
              <SelectValue placeholder='Select your gender' />
            </SelectTrigger>
            <SelectContent className='bg-white border-2 border-blue-300 rounded-xl shadow-xl'>
              <SelectItem
                value='Male'
                className='text-lg py-3 hover:bg-blue-50 focus:bg-blue-100'
              >
                👨 Male
              </SelectItem>
              <SelectItem
                value='Female'
                className='text-lg py-3 hover:bg-blue-50 focus:bg-blue-100'
              >
                👩 Female
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-3'>
          <Label
            htmlFor='drug'
            className='text-ocean-700 font-semibold text-lg'
          >
            Drug Name
          </Label>
          <Select
            value={userInfo.drugName}
            onValueChange={(value) =>
              setUserInfo((prev) => ({ ...prev, drugName: value }))
            }
          >
            <SelectTrigger className='h-12 text-lg border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-400 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300'>
              <SelectValue placeholder='Select a drug name to pronounce' />
            </SelectTrigger>
            <SelectContent className='bg-white border-2 border-blue-300 rounded-xl shadow-xl'>
              {DRUG_NAMES.map((drug, index) => (
                <SelectItem
                  key={drug}
                  value={drug}
                  className='text-lg py-3 hover:bg-blue-50 focus:bg-blue-100'
                >
                  {index + 21}- 💊 {drug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onSubmit}
          className='w-full h-14 bg-gradient-to-r from-mint-500 to-ocean-500 hover:from-mint-600 hover:to-ocean-600 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
        >
          Continue →
        </Button>
      </CardContent>
    </>
  );
};

export default UserInfoForm;
