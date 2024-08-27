import { getCompanies } from '@/api/companiesApi';
import { getJobs } from '@/api/jobsAPI';
import { Button, Input, JobCard, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components';


import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/clerk-react';
import cities from '../data/cities.json'
import React, { useEffect, useRef, useState } from 'react'
import { BarLoader } from 'react-spinners';

function JobListing() {

  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [company_id, setCompany_id] = useState("")
  const { isLoaded } = useUser()
  const inputRef = useRef(null)


  // get all jobs
  const { fn: fetchJobsFn, data: jobData, error, loading: jobLoading } = useFetch(getJobs, { location, company_id, searchQuery });

  useEffect(() => {
    if (isLoaded) {
      fetchJobsFn();
    }
  }, [isLoaded, searchQuery, company_id, location])


  // jobs filter
  const { fn: fnGetCompanies, data: companies } = useFetch(getCompanies)

  useEffect(() => {
    if (isLoaded) {
      fnGetCompanies();
    }
  }, [isLoaded, searchQuery, company_id, location])




  function handleSearch(e) {
    e.preventDefault();

    let formData = new FormData(e.target);

    const query = formData.get("searchQuery")
    if (query) setSearchQuery(query)
  }




  function clearFilters() {
    inputRef.current.value = ""
    setSearchQuery(inputRef.current.value)
    setLocation("")
    setCompany_id("")
  }
  // bar loader
  if (!isLoaded) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7  ' />
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>

      {/* job filter */}
      <form onSubmit={handleSearch} className='flex h-11 w-full gap-2 items-center mb-4'>

        <Input
          type="text"
          placeholder="search Jobs by title ..."
          className="h-full flex-1 px-4 text-md"
          name="searchQuery"
          ref={inputRef}
        />
        <Button type='submit' variant='blue' className='h-full sm:w-28'>Search</Button>
      </form>

      <div className='flex flex-col sm:flex-row gap-2'>
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select a state" />
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

        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select a company" />
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

        <Button
          variant='destructive'
          className='sm:w-1/2'
          onClick={clearFilters}
        >
          Clear filters
        </Button>
      </div>

      {jobLoading && <BarLoader className='mt-4' width={"100%"} color='"#36d7b7' />}

      {/* display all job */}
      {jobLoading === false && (
        <div className='mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>

          {
            jobData?.length ? (
              jobData.map((job) => {
                return <JobCard key={job.id} job={job} isSaved={job?.saved.length > 0} />
              })
            )
              :
              (
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