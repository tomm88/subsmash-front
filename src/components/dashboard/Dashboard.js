import React from 'react'
import { SubsTable } from './SubsTable'
import { CopyUrlBox } from './CopyUrlBox'

export const Dashboard = () => {
  return (
    <>
      <div className='heading-container'> 
        <h1>
          Welcome to your dashboard
        </h1>
        <CopyUrlBox />
      </div>
      <SubsTable />
    </>
  )
}
