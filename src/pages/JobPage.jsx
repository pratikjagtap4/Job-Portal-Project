import { getSingleJob } from '@/api/jobsAPI'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import { BriefcaseBusiness, DoorClosed, DoorOpen, MapPin } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

function JobPage() {
  const { isLoaded, user } = useUser()
  const { id } = useParams()

  const { fn: fnJob, data: jobData, loading: loadingJob } = useFetch(getSingleJob, {
    job_id: id
  });

  console.log(jobData)

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded])

  if (!isLoaded || loadingJob) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }

  return (
    <div className='mx-10'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center '>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{jobData?.title}</h1>
        <img src={jobData?.company?.logo_url} alt="" className='h-12' />
      </div>

      {/* job details */}
      <div className='flex justify-between mt-5'>
        <div className='flex gap-2'>
          {<MapPin />}
          {jobData?.location}
        </div>

        <div className='flex gap-2'>
          {<BriefcaseBusiness />}
          {jobData?.applications?.length} Applicants
        </div>

        <div className='flex gap-2'>
          {jobData?.isOpen ? (<><DoorOpen /> open</>) : (<><DoorClosed />  closed</>)}
        </div>
      </div>

      {/* hiring status */}

      <h2 className='text-2xl sm:text-3xl font-bold mt-10'>About the Job</h2>
      <p className='sm:text-lg'>{jobData?.description} </p>

      <h2 className='text-2xl sm:text-3xl font-bold mt-10'>What are looking for</h2>
      

    </div>
  )
}

export default JobPage