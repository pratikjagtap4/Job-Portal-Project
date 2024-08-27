import { getSingleJob, updateHiringStatus } from '@/api/jobsAPI'
import { ApplyJobDrawer, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import MDEditor from '@uiw/react-md-editor'
import { BriefcaseBusiness, DoorClosed, DoorOpen, MapPin } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

function JobPage() {
  const { isLoaded, user } = useUser()
  const { id } = useParams()

  const { fn: fnJob, data: jobData, loading: loadingJob } = useFetch(getSingleJob, { job_id: id });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded])

  const { fn: fnUpdateStatus, loading: loadingHiringStatus } = useFetch(updateHiringStatus, { job_id: id });

  function handleUpdateStatus(value) {
    const isOpen = value === "open";

    fnUpdateStatus(isOpen).then(() => fnJob())
  }

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
      <div className='flex justify-between mt-5 items-center'>
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

        {/* hiring status */}

        {loadingHiringStatus && <BarLoader width={"100%"} color='#36d7b7' />}
        {
          jobData?.recruiter_id === user?.id && <div>
            <Select onValueChange={(value) => handleUpdateStatus(value)} className='px-10'>
              <SelectTrigger className={` bg-transparent ${jobData?.isOpen ? ("text-green-400") : ("text-red-500")}`}>
                <SelectValue placeholder={"hiring status : " + (jobData?.isOpen ? " open    " : " closed  ")} />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="open" >
                  open
                </SelectItem>
                <SelectItem value="closed">
                  closed
                </SelectItem>
              </SelectContent>
            </Select>

          </div>
        }

      </div>

      {/* descriptions */}
      <h2 className='text-2xl sm:text-3xl font-bold mt-10'>About the Job</h2>
      <p className='sm:text-lg'>{jobData?.description} </p>

      {/* requirements */}
      <h2 className='text-2xl sm:text-3xl font-bold mt-10'>What are looking for</h2>

      <div>
        {jobData?.requirements.split("-").map((data, index) => {
          return <li key={index} className='my-2'>{data}</li>
        })}
      </div>

      {/* applying jobs */}

      {jobData?.recruiter_id !== user.id && (
        <ApplyJobDrawer jobData={jobData} user={user} fetchJob={fnJob} applied={jobData?.applications?.find((ap) => ap.candidate_id === user.id)} />
      )}
    </div>
  )
}

export default JobPage