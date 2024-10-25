import React from 'react';
import { PromptBuilder } from './PromptBuilder';
import { CopyUrlBox } from '../dashboard/CopyUrlBox'

export const MyPrompt = () => {
  return (
    <div className='prompt-page'>
      <PromptBuilder />
      <CopyUrlBox />
    </div>
  )
}
