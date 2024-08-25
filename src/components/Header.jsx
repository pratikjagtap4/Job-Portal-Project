import { SignedIn, SignedOut, SignIn, UserButton, useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react'

function Header() {
    const [showSignIn, setShowSignIn] = useState(false);
    const [search, setSearch] = useSearchParams()        // this hook from react router dom fetch the value of identifier from url
    const { user } = useUser()

    function handleOverLayClick(e) {
        if (e.target === e.currentTarget) {    //currentTarget :- this event is generally associated with parents and it triggers when any of the children is clicked
            setShowSignIn(false)                // target :- this event is exact and triggers only when the associated elemnt is clicked , it does
            setSearch({})
        }
    }


    useEffect(() => {
        if (search.get("sign-in")) setShowSignIn(true)
    }, [search])


    return (
        <>
            <nav className='py-4 pl-10 flex justify-between items-center'>
                <Link to='/'>
                    <img src="logo.png" alt="" className='h-10' />
                </Link>

                <div className="flex gap-6">

                    <SignedOut>
                        <Button
                            variant='outline'
                            className="rounded-full"
                            onClick={() => setShowSignIn(true)}
                        >
                            Login
                        </Button>
                    </SignedOut>

                    {user?.unsafeMetadata?.role === "recruiter" && <Link to="/postjobs">
                        <Button
                            variant="destructive"
                            className="rounded-full"
                        >
                            <PenBox size={20} className='mr-2' />
                            Post Jobs
                        </Button>
                    </Link>}
                    <SignedIn>
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10"
                            }
                        }}
                        >
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label='my jobs'
                                    labelIcon={<BriefcaseBusiness size={15} />}
                                    href='/myjobs'
                                />

                                <UserButton.Link
                                    label='Saved jobs'
                                    labelIcon={<Heart size={15} />}
                                    href='/savedjobs'
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>
                </div>
            </nav>

            {
                showSignIn && (
                    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 '
                        onClick={handleOverLayClick}
                    >
                        <SignIn
                            signUpFallbackRedirectUrl='/onboarding'
                            fallbackRedirectUrl='/onboarding'
                        />
                    </div>
                )
            }
        </>
    )
}

export default Header