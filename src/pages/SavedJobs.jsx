import { getSavedJobs } from '@/api/jobsAPI'
import { JobCard } from '@/components'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'

function SavedJobs() {
  const { fn: fnGetSavedJobs, loading: loadingSavedJobs, data: dataSavedJobs, error: errorSavedJobs } = useFetch(getSavedJobs)

  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded) fnGetSavedJobs();
  }, [isLoaded])


  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center mt-20'>Saved Jobs</h1>
      {
        loadingSavedJobs === false && (
          <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {dataSavedJobs?.length > 0 ? (
              dataSavedJobs?.map((saved) => {
                return <JobCard
                  key={saved?.id}
                  job={saved?.jobs}
                  isSaved={true}
                  isMyJob={saved.jobs.recruiter_id == user.id}
                  onJobAction={fnGetSavedJobs}
                />
              })
            )
              :
              (
                <div style={{ width: "93vw" }}>
                  <p className='gradient-title font-extrabold text-2xl sm:text-4xl text-center  mt-10'>No jobs found</p>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default SavedJobs