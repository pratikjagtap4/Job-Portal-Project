import React from 'react'
import { Button, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, Input, JobCard, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '.'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import useFetch from '@/hooks/useFetch'
import { applyToJob } from '@/api/applicationAPI'
import { BarLoader } from 'react-spinners'

const schema = z.object({
    age: z.number().min(18, { message: "Age must be atleast 18" }).int(),
    experience: z.number().min(0, { message: "Experience must be atleast 0" }).int(),
    skills: z.string().min(3, { message: "Minimum 3 skills are required" }),
    education: z.enum(["underGraduate", "Graduate", "postGraduate"], { message: "Education is required" }),
    passout_year: z.enum(["2021", "2022", "2023", "2024"], { message: "Passout Year  is required" }),
    resume: z.any().refine((file) => file[0] && (file[0].type === "application/pdf" || file[0].type === "application.msword"), { message: "Only PDF and Word documents are allowed" })
})

function ApplyJobDrawer({ jobData, user, fetchJob, applied = false }) {

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema)
    })

    const { fn: fnApply, loading: loadingApply, error: errorApply } = useFetch(applyToJob)

    function onApply(data) {
        fnApply({
            ...data,
            job_id: jobData.id,
            candidate_id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            status: "applied",
            resume: data.resume[0]
        }).then(() => {
            fetchJob()
            reset()
        })
    }
    return (
        <div className='flex justify-center w-full mt-10'>
            <Drawer open={applied ? false : undefined} >
                <DrawerTrigger asChild>
                    <Button
                        size="lg"
                        variant={jobData?.isOpen && !applied ? "blue" : "destructive"}
                        disable={jobData?.isOpen || applied ? true.toString() : undefined}
                        className='w-full'
                    >
                        {jobData?.isOpen ? (applied ? "Already Applied" : "Apply Now") : ("Stop hiring")}
                    </Button>
                </DrawerTrigger>
                <DrawerContent className='p-10'>
                    <DrawerHeader>
                        <DrawerTitle>Apply for {jobData?.title} at {jobData?.company?.name}</DrawerTitle>
                        <DrawerDescription>Please fill the form below.</DrawerDescription>
                    </DrawerHeader>
                    <form onSubmit={handleSubmit(onApply)} className='flex flex-col gap-4 p-4 pb-0'>


                        <Input
                            type="number"
                            placeholder="age"
                            className="flex-1"
                            {...register("age", { valueAsNumber: true })}
                        />
                        {errors.age && (<p className='text-red-500'>{errors.age.message}</p>)}


                        <Input
                            type="number"
                            placeholder="Years of Experience"
                            className="flex-1"
                            {...register("experience", { valueAsNumber: true })}
                        />
                        {errors.experience && (<p className='text-red-500'>{errors.experience.message}</p>)}


                        <Input
                            type="text"
                            placeholder="Skills (comma separated)"
                            className="flex-1"
                            {...register("skills")}
                        />
                        {errors.skills && (<p className='text-red-500'>{errors.skills.message}</p>)}


                        <Controller
                            name="education"
                            control={control}
                            render={({ field }) => {
                                return <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Education" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="underGraduate">
                                                Under Graduate
                                            </SelectItem>
                                            <SelectItem value="Graduate">
                                                Graduate
                                            </SelectItem>
                                            <SelectItem value="postGraduate">
                                                Post Graduate
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            }}
                        />
                        {errors.education && (<p className='text-red-500'>{errors.education.message}</p>)}

                        <Controller
                            name="passout_year"
                            control={control}
                            render={({ field }) => {
                                return <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Passout Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="2021">
                                                2021
                                            </SelectItem>
                                            <SelectItem value="2022">
                                                2022
                                            </SelectItem>
                                            <SelectItem value="2023">
                                                2023
                                            </SelectItem>
                                            <SelectItem value="2024">
                                                2024
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            }}
                        />
                        {errors.passoutYear && (<p className='text-red-500'>{errors.passoutYear.message}</p>)}

                        <Input
                            type="file"
                            accept=" .pdf , .doc , .docx"
                            className="flex-1 file:text-gray-500"
                            {...register("resume")}
                        />
                        {errors.resume && (<p className='text-red-500'>{errors.resume.message}</p>)}

                        {errorApply.message && (<p className='text-red-500'>{errorApply.message}</p>)}
                        {loadingApply && <BarLoader width={"100%"} color='#36d7b7' />}
                        <Button type="submit" variant='blue' size='lg'>Submit</Button>

                    </form>
                    <DrawerFooter>

                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default ApplyJobDrawer