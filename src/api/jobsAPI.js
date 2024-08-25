import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token); // this takes token which is provided by clerk , The token is passed to the Supabase client to authenticate and authorize the user’s requests to the Supabase database. It ensures that only authorized users can access or modify data in the database.

  const query = supabase
    .from("jobs")
    .select("* , company:companies(name, logo_url) , saved:saved_jobs(id)");

  // this query return json format , but it only returns company id , as we know company id is foregn key in jobs tablewe can fetch the other data using foreign key relation
  // company:companies(name,logo) : it returns object of name copany and fetched name and logo_url data from companies table using the foreign key relation
  if (location) {
    query = query.eq("location", location); // eq compares the given value with value from location colunm(1st paramater is column name) and returns rows for which the the value matches
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`); // ilike is for pattern matching in sql
  }

  const { data, error } = await query;

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
