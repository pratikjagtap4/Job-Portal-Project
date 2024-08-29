import { Button, Input, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components';
import { useUser } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import cities from '../data/cities.json'
import useFetch from '@/hooks/useFetch';
import { getCompanies } from '@/api/companiesApi';
import { BarLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';
import { addNewJob } from '@/api/jobsAPI';
import { Navigate, useNavigate } from 'react-router-dom';
import AddCompanyDrawer from '@/components/AddCompanyDrawer';

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "description is required" }),
  requirements: z.string().min(1, { message: "requirements is required" }),
  company_id: z.string().min(1, { message: "company_id is required" }),
  location: z.string().min(1, { message: "location is required" }),
  package: z.number().min(1000000, { message: "Package must be more than 10 Lakh" }).int(),
})

function PostJob() {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  })

  const { user, isLoaded } = useUser()
  const navigate = useNavigate()
  const { fn: fnGetCompanies, data: companies, loading: loadingCompanies } = useFetch(getCompanies)

  useEffect(() => {
    if (isLoaded)
      fnGetCompanies()
  }, [isLoaded])

  const { fn: fnCreateNewJob, data: createNewJobData, loading: createNewJobLoading, error: createNewJobError } = useFetch(addNewJob)

  function subitJobDetails(data) {
    fnCreateNewJob({
      ...data,
      recruiter_id: user.id
    })
    reset()
  }

  useEffect(() => {
    if (createNewJobData?.length > 0) {
      navigate('/jobs')
    }
  }, [createNewJobLoading])

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }
  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />
  }
  return (
    <div>
      <h1 className='text-center gradient-title text-5xl sm:text-7xl font-extrabold mt-20'>Post a Job</h1>

      <form onSubmit={handleSubmit(subitJobDetails)} className='mt-5 flex flex-col gap-5'>
        <Input
          type="text"
          placeholder="Enter job title"
          {...register("title")}
        />
        {errors?.title && <p className='text-red-500'>{errors?.title?.message}</p>}


        <Textarea
          type="text"
          placeholder="Enter job description"
          {...register("description")}
        />
        {errors?.description && <p className='text-red-500'>{errors?.description?.message}</p>}

        <Input
          type="number"
          placeholder="Enter job salary"
          {...register("package", { valueAsNumber: true })}
        />
        {errors?.package && <p className='text-red-500'>{errors?.package?.message}</p>}
        <div className='flex flex-col sm:flex-row gap-6'>
          <Controller
            name='location'
            control={control}
            render={({ field }) => (

              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cities.map((name) => {
                      return (<SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>);
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name='company_id'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a company" >
                    {field.value ? companies?.find((com) => com.id === Number(field.value))?.name : "company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => {
                      return (<SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>);
                    })}

                  </SelectGroup>
                </SelectContent>
              </Select>

            )}
          />
          <AddCompanyDrawer fetchComapny={fnGetCompanies} />
        </div>
        {errors?.location && <p className='text-red-500'>{errors?.location?.message}</p>}
        {errors?.company_id && <p className='text-red-500'>{errors?.company_id?.message}</p>}

        <Controller
          name='requirements'
          control={control}
          render={({ field }) => (
            <MDEditor
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors?.requirements && <p className='text-red-500'>{errors?.requirements?.message}</p>}
        {createNewJobError?.message && (<p className='text-red-500'>{createNewJobError?.message}</p>)}
        {createNewJobLoading && <BarLoader className='w-full' width={"100%"} color='#36d7b7' />}

        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>

    </div>
  )
}

export default PostJob