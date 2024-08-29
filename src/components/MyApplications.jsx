import { getApplications } from '@/api/applicationAPI'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import { ApplicationCard } from '.'

function MyApplications() {
    const { user, isLoaded } = useUser()

    const { fn: fnGetApplications, data: applicationsData, loading: loadingApplications } = useFetch(getApplications, {
        user_id: user.id
    })

    useEffect(() => {
        fnGetApplications()
    }, [])

    if (!isLoaded || loadingApplications) {
        return <BarLoader className='mt-4' width={"100%"} color='#36d7b7' />
    }
    return (
        <div>
            {applicationsData?.map((application) => {
                return <ApplicationCard key={application.id} application={application} isCandidate />
            })}
        </div>
    )
}

export default MyApplications