import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

export const ErrorText = ({ field, errors }) => 
    errors[field] ? (
    <p className="text-red-500 text-sm flex items-center">
      <ExclamationCircleIcon className="w-4 h-4 mr-1" />
      {errors[field]}
    </p>
  ) : null;