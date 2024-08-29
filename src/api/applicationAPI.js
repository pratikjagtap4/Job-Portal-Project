import config from "@/conf/config";
import supabaseClient from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const fileName = `resume-${jobData.candidate_id}-${jobData.firstName}-${jobData.lastName}`;

  async function checkIfResumeExists(name) {
    const { data, error } = await supabase.storage.from("resumes").list("", {
      search: name,
    });

    if (error) {
      console.error("Error uploading resume:", error);
      return false;
    }

    return data.some((file) => file.name === name);
  }

  const fileExists = await checkIfResumeExists(fileName);
  if (!fileExists) {
    const { error: storageError } = await supabase.storage
      .from("resumes")
      .upload(fileName, jobData.resume);

    if (storageError) {
      console.log("error uploading resume", storageError);
      return null;
    }
  }

  const resume = `${config.supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("application")
    .insert({ ...jobData, resume })
    .select();

  if (error) {
    console.log("Error submitting application", error);
  }
  return data;
}

export async function updateApplicationsStatus(
  token,
  { job_id, candidate_id },
  status
) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("application")
    .update({ status })
    .eq("job_id", job_id)
    .eq("candidate_id", candidate_id)
    .select();

  if (error || data.length === 0) {
    console.log("Error updating Applications status", error);
    return null;
  }
  console.log(data);

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("application")
    .select("* , job: jobs(title , company : companies (name))")
    .eq("candidate_id", user_id);

  if (error || data.length === 0) {
    console.log("Error fetching Applications ", error);
    return null;
  }
  console.log(data);

  return data;
}
