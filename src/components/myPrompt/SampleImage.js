import React from 'react'

export const SampleImage = ({ sampleImage }) => {
    const { imageUrl, characterName } = sampleImage
    console.log(sampleImage)
            
  return (
    <div className='sample-image-container'>
        <h3>{characterName}</h3>
        <img className='sample-image' src={imageUrl} alt="Generated character" />
    </div>
  )
}
