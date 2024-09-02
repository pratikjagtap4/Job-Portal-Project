import { getSingleJob, updateHiringStatus } from '@/api/jobsAPI'
import { ApplicationCard, ApplyJobDrawer, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import { BriefcaseBusiness, DoorClosed, DoorOpen, IndianRupee, MapPin } from 'lucide-react'
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
  const applicationStatus = jobData?.applications?.find((ap) => ap.candidate_id == user.id)?.status

  if (!isLoaded || loadingJob) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }

  return (
    <div className='sm:mx-10'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center '>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{jobData?.title}</h1>
        <img src={jobData?.company?.logo_url} alt="" className='h-12 mt-10 sm:mt-3' />
      </div>

      {/* job details */}
      <div className='mt-5 items-center grid grid-cols-2 sm:grid-cols-4'>
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
          jobData?.recruiter_id === user?.id ? (
            <div className='mt-2 sm:mt-0'>
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
          ) : (applicationStatus &&
            <span className="w-52 capitalize flex justify-center items-center gap-2">
              Application Status : <p className={`${applicationStatus === "hired" ? ("text-green-400") : ("")} ${applicationStatus === "rejected" ? ("text-red-400") : ("")} `}>{applicationStatus}</p>
            </span>
          )
        }

      </div>

      {/* descriptions */}
      <h2 className='text-2xl sm:text-3xl font-bold mt-10 mb-3'>About the Job</h2>
      <p className='sm:text-lg'>{jobData?.description} </p>
      <h4 className='text-2xl sm:text-3xl font-bold mt-7 mb-3'>Package and Variable pay</h4>
      <p className='sm:text-lg flex items-center'> Salary :  <IndianRupee size={17} /> {jobData?.package} /- & variable pay based on performance</p>

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

      {
        jobData?.applications?.length > 0 && jobData.recruiter_id == user.id && (
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl sm:text-3xl font-bold mt-10'>Applications</h2>
            {jobData?.applications?.map((application) => {
              return <ApplicationCard key={application.id} application={application} />
            })}
          </div>
        )
      }
    </div>
  )
}

export default JobPage