import { getJobs } from '@/api/jobsAPI';
import { JobCard } from '@/components';
import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';

function JobListing() {

  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [company_id, setCompany_id] = useState("")
  const { isLoaded } = useUser()

  const { fn: fetchJobsFn, data: jobData, error, loading: jobLoading } = useFetch(getJobs, { searchQuery, company_id, location });

  useEffect(() => {
    if (isLoaded) { fetchJobsFn(); }
  }, [isLoaded, searchQuery, company_id, location])

  if (!isLoaded) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7  ' />
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>

      {/* job filter */}
      {jobLoading && <BarLoader className='mt-4 ' width={"100%"} color='"#36d7b7' />}

      {/* display all job */}
      {jobLoading === false && (
        <div className='mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {jobData?.length ? (
            jobData.map((job) => {
              return <JobCard key={job.id} job={job} isSaved={job?.saved.length > 0} />
            })
          ) : (
            <h2>No Jobs found</h2>
          )
          }
        </div>
      )
      }

    </div>
  )
}

export default JobListing