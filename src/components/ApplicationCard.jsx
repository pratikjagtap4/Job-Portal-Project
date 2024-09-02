import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '.'
import { Boxes, BriefcaseBusiness, Calendar, Download, School } from 'lucide-react'
import { updateApplicationsStatus } from '@/api/applicationAPI'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'

function ApplicationCard({ application, isCandidate = false }) {
    function handleDownload() {
        const link = document.createElement("a")
        link.href = application?.resume
        link.target = "blank"
        link.click()
    }
    const { user } = useUser()

    const { loading: loadingApplicationStatus, fn: fnApplicationStatus } = useFetch(updateApplicationsStatus, {
        job_id: application.job_id,
        candidate_id: application.candidate_id

    })

    function handleStatusChange(status) {
        fnApplicationStatus(status)
    }

    return (
        <div >
            <Card className=' mt-5'>
                <CardHeader>
                    <CardTitle className='flex justify-between items-center'>
                        <div>
                            {isCandidate ? (`${application?.job?.title} at ${application?.job?.company?.name}`) : (`${application?.firstName} ${application?.lastName} `)}
                        </div>
                        <Download
                            size={18}
                            className='bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer'
                            onClick={handleDownload}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 sm:grid-cols-4 '>
                        <div className='flex gap-3 mt-5'>
                            <BriefcaseBusiness />
                            {application?.experience} years of exp.
                        </div>
                        <div className='flex gap-2 items-center mt-5'>
                            <Calendar />
                            PassoutYear : {application?.passout_year}
                        </div>

                        <div className='flex gap-3 mt-5'>
                            <School />
                            Education : {application?.education}.
                        </div>
                        <div className='flex gap-2 items-center mt-5'>
                            <Boxes />
                            Skills : {application?.skills}
                        </div>
                    </div>
                </CardContent>
                <hr />
                <CardFooter className='grid grid-cols-1 sm:grid-cols-2 mt-2 items-center'>
                    <span> Applied on :  {new Date(application?.created_at).toLocaleDateString()}</span>
                    {!isCandidate && (
                        <Select onValueChange={handleStatusChange} defaultValue={application?.status}>
                            <SelectTrigger className="w-52 mt-5">
                                <SelectValue placeholder="Application Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="applied">
                                        Applied
                                    </SelectItem>
                                    <SelectItem value="interviewing">
                                        Interviewing
                                    </SelectItem>
                                    <SelectItem value="hired">
                                        Hired
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

export default ApplicationCard