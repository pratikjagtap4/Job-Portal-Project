import { CreatedJobs, MyApplications } from '@/components'
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { BarLoader } from 'react-spinners'

function MyJobs() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }
  return (
    <div>
      <h1 className='gradient-title font-extrabold text-center text-5xl sm:text-7xl mt-8 '>
        {
          user.unsafeMetadata.role === "candidate" ? ("My Applications") : ("My Created Jobs")
        }
      </h1>
      <div className='flex flex-col '>

        {user.unsafeMetadata.role === "candidate" ? (<MyApplications />) : (<CreatedJobs />)}
      </div>
    </div>
  )
}

export default MyJobs