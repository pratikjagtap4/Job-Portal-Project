import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { JobListing, JobPage, LandingPage, MyJobs, OnBoarding, PostJob, SavedJobs } from './pages/index.js'
import config from './conf/config.js'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark, shadesOfPurple } from '@clerk/themes'
import { ProtectedRoute } from './components/index.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='/' element={<LandingPage />} />
      <Route path='/onboarding' element=
        {<ProtectedRoute>
          <OnBoarding />
        </ProtectedRoute>
        }
      />
      <Route path='/jobs' element=
        {<ProtectedRoute>
          <JobListing />
        </ProtectedRoute>
        } />
      <Route path='/job/:id' element=
        {<ProtectedRoute>
        
          <JobPage />
        </ProtectedRoute>
        } />
      <Route path='/postjobs' element=
        {<ProtectedRoute>
          <PostJob />
        </ProtectedRoute>
        } />
      <Route path='/savedjobs' element=
        {<ProtectedRoute>
          <SavedJobs />
        </ProtectedRoute>
        } />
      <Route path='/myjobs' element=
        {<ProtectedRoute>
          <MyJobs />
        </ProtectedRoute>
        } />
    </Route>
  )
)

const PUBLISHABLE_KEY = config.clerkPublishableKey;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl="/"
    appearance={{
      baseTheme: dark
    }}
  >
    <RouterProvider router={router} />
  </ClerkProvider>
)


// how to connect supabase and clerk
// -->
// 1)        create jwt templates in clerk , create new template , select supabase it will ask for supabase api key
// 2)        go to supabase -> project setting -> api -> secrete api key 
// 3)        paste the secrete key in signing key of clerk-supabase connection
// 4)        now copy the sql query from the clerk-supabase connection doc and run it in sql editor of supabase
// 5)        right function in supabase.js to check if user authorize or not