'use client';

import { Suspense } from 'react';
import { SuccessPageContent } from './SuccessPageContent';

const SuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
