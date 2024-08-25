import { useSession } from "@clerk/clerk-react"
import { useState } from "react";


function useFetch(callbackfn, options = {}) {               //
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const { session } = useSession();

    const fn = async (...args) => {             // this fn function is used inside event handlers , this fn takes some arguments after a event and passed those arguments to the provided callbackfn                                                 //
        setLoading(true);                       // this callbackfn is usually a function that interacts with supabase backend like savejpb , deletejob.
        setError(false);

        try {
            const supabaseAccessToken = await session.getToken({
                template: "supabase",
            });


            const response = await callbackfn(supabaseAccessToken, options, ...args)       // this callbackfn is function from jobsAPI that interact with sapbaseClient backend and perform operations like querying data , inserting data and all
            setData(response)                                                               // options is object to filter the query
            setError(false)

        }
        catch (error) {
            setError(true)
        }
        finally {
            setLoading(false);
        }

    }
    return { fn, data, error, loading }
}
export default useFetch



// What is session ?
//                  A session represents the current authenticated state of a user in an application.It typically contains information about the user, such as their unique ID, authentication status, and any tokens or credentials needed to access resources.
//                  In a web application, when a user logs in, a session is created to track that user's activity. This session is often stored on the server or in a client-side storage mechanism, like cookies or local storage.
// The session object usually includes a token(like a JWT) that can be used to authenticate the user when making requests to a backend or API.

//token :-
//                  The token is a form of authentication credential, typically a JSON Web Token(JWT).It is used to securely communicate between the frontend and backend, ensuring that the user making the request is authenticated.
//                  Clerk generates this token, which includes information about the user's session. This token is then used to authenticate requests to other services like Supabase.

