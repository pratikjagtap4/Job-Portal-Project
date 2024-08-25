import supabaseClient from "@/utils/supabase";

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
    console.log(data);
    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert(saveData)
      .select();

    if (insertError) {
      console.log("error inserting data", insertError);
      return null;
    }
    console.log(data);
    return data;
  }
}
