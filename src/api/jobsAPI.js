import useFetch from "@/hooks/useFetch";
import supabaseClient from "@/utils/supabase";
import { any } from "zod";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token); //                           this takes token which is provided by clerk , The token is passed to the Supabase client to authenticate and authorize the user’s requests to the Supabase database. It ensures that only authorized users can access or modify data in the database.

  const query = supabase
    .from("jobs") //                                                           this query return json format , but it only returns company id , as we know company id is foregn key in jobs tablewe can fetch the other data using foreign key relation
    .select("* , company:companies(name, logo_url) , saved:saved_jobs(id)"); // company:companies(name,logo) : it returns object of name copany and fetched name and logo_url data from companies table using the foreign key relation

  const { data, error } = await query;

  if (company_id) {
    return data.filter((company) => company.company_id === company_id);
  }

  if (location) {
    return data.filter((company) => company.location === location);
  }

  if (searchQuery) {
    return data.filter((company) =>
      company.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (error) {
    console.log("error fetching data", err);
    return null;
  }

  return data;
}

// supabaseClient :-
//              The supabaseClient is a function or module that initializes the Supabase client.
//              The supabaseClient function takes the authentication token(provided by Clerk) as an argument and returns an instance of the Supabase client that is authenticated with this token.
//              This authenticated Supabase client instance is used to interact with the Supabase backend, allowing you to perform operations like querying the database, inserting data, and more, all while ensuring that the operations are performed by an authenticated user.

export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.log("error deleting saved job", deleteError);
      return null;
    }
    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.log("error inserting data", insertError);
      return null;
    }
    return data;
  }
}

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "* , company:companies(name,logo_url) , applications:application(*)"
    )
    .eq("id", job_id)
    .single();

  if (error) {
    console.log("Error fetching job", error);
    return null;
  }
  return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.log("Error updating job", error);
    return null;
  }

  return data;
}

export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.log("Error inserting new Job", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("* , jobs : jobs(* , company : companies(name , logo_url))");

  if (error) {
    console.log("Error fetching saved jobs", error);
    return null;
  }

  return data;
}

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("* , company:companies(name , logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.log("Erros fetching created jobs", error);
    return null;
  }
  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.log("Error deleting job", error);
    return null;
  }

  return data;
}
