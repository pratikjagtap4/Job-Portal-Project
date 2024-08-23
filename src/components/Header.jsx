import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <>
            <nav className='py-4 pl-10 flex justify-between items-center'>
                <Link to='/'>
                    <img src="logo.png" alt="" className='h-10' />
                </Link>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </nav>
        </>
    )
}

export default Header