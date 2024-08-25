
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

function OnBoarding() {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate();

  async function handleRoleSelection(role) {
    await user.update({                           //.update() method helps to update user object
      unsafeMetadata: { role }                    // this unsafe metadata is property of user object which can be edited from fontend ,we can store some info related to user in this metadata , since role of user does not propose any threat to user security we can store it in unsafe metadata
    }).then(() => {
      navigate(role === 'recruiter' ? '/postjobs' : '/jobs')
    }).catch((err) => {
      console.log("Error updating role :", err)
    })
  }

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(user?.unsafeMetadata?.role === 'recruiter' ? '/postjobs' : '/jobs')
    }

  }, [user])

  if (!isLoaded) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7  ' />
  }

  return (
    <div className='flex flex-col justify-center items-center mt-40 '>
      <h2 className='gradient-title font-extrabold text-5xl sm:text-8xl tracking-tighter'>I am a ...</h2>
      <div className='mt-16 grid grid-cols-2 gap-20 w-full md:px-60'>
        <Button size='xl' variant="blue" onClick={() => handleRoleSelection("candidate")} >Candidate</Button>
        <Button size='xl' variant="destructive" onClick={() => handleRoleSelection("recruiter")} >Recruiter</Button>
      </div>
    </div>
  )
}

export default OnBoarding