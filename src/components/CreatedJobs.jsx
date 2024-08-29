import { getMyJobs } from '@/api/jobsAPI'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import { JobCard } from '.'

function CreatedJobs() {
    const { user, isLoaded } = useUser()
    const { fn: fnMyJobs, data: dataMyJobs, loading: loadingMyJobs } = useFetch(getMyJobs, {
        recruiter_id: user.id
    })
    useEffect(() => {
        fnMyJobs()
    }, [])

    if (!isLoaded || loadingMyJobs) {
        return <BarLoader className='mt-4' width={"100%"} color='#36d7b7' />
    }
    return (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10'>
            {dataMyJobs?.length > 0 && (dataMyJobs.map((job) => {
                return <JobCard key={job.id} job={job} isMyJob={job.recruiter_id == user.id} onJobAction={fnMyJobs} />
            }))}
        </div>
    )
}

export default CreatedJobs