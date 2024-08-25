import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Heart, MapPinIcon, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import useFetch from '@/hooks/useFetch';
import { saveJob } from '@/api/saveJobAPI';

function JobCard({
    job,
    isMyJob = false,
    isSaved = false,
    onJobSaved = () => { },
}) {
    const { user } = useUser();
    const [saved, setSaved] = useState(isSaved)
    console.log(saved, job.id)
    const {
        fn: fnSavedJob,
        data: savedJob,
        loading: loadingSavedJob,
    } = useFetch(saveJob, {                     // this is saveJob is call inside the useFetch hook , interacts with supabase backend and returns data
        alreadySaved: saved,
    });

    async function handleSaveJob() {
        await fnSavedJob({
            user_id: user.id,
            job_id: job.id
        })
    }

    useEffect(() => {
        if (savedJob !== undefined) {
            setSaved(savedJob?.length > 0)
        }
    }, [savedJob])
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex justify-between font-bold'>
                    {job?.title}
                    {isMyJob && (<Trash stroke='red' size={18} className='text-red-300 cursor-pointer' />)}
                </CardTitle>

            </CardHeader>
            <CardContent className='flex flex-col gap-4 flex-1'>
                <div className='flex justify-between'>
                    {job?.company && <img src={job.company.logo_url} alt="" className='h-6' />}
                    <div className='flex gap-2 items-center'>
                        <MapPinIcon size={18} /> {job?.location}
                    </div>
                </div>
                <hr />
                {job?.description.substring(0, job.description.indexOf(".")) + " ..."}
            </CardContent>
            <CardFooter className='flex gap-2'>
                <Link to={`/job/${job.id}`} className='flex-1'>
                    <Button variant='secondary' className='w-full'>
                        More details ...
                    </Button>
                </Link>

                {/* wishlisting job */}
                {
                    !isMyJob && (
                        <Button
                            variant='outline'
                            className='w-15'
                            onClick={handleSaveJob}
                            disabled={loadingSavedJob}
                        >
                            {saved ? (<Heart size={20} stroke='red' fill='red' />) : (<Heart size={20} />)}
                        </Button>
                    )
                }
            </CardFooter>
        </Card>
    )
}

export default JobCard