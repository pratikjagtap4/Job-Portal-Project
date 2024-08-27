import config from "@/conf/config";
import supabaseClient from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
  console.log("applyjob called");

  const supabase = await supabaseClient(token);

  const fileName = `resume-${jobData.candidate_id}-${jobData.name}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.log("error uploading resume", storageError);
    return null;
  }

  const resume = `${config.supabaseUrl}/storage/v1/object/public/resumes/filename`;

  const { data, error } = await supabase
    .from("application")
    .insert({ ...jobData, resume })
    .select();

  if (error) {
    console.log("Error submitting application", error);
  }
  return data;
}
