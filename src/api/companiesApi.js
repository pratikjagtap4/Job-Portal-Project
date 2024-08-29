import config from "@/conf/config";
import supabaseClient from "@/utils/supabase";

export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.log("error fteching companies data", error);
    return null;
  }
  return data;
}

export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  const fileName = `logo-${companyData.name}`;
  async function checkIfLogoExists(name) {
    const { data, error } = await supabase.storage
      .from("company_logo")
      .list("", {
        search: name,
      });

    if (error) {
      console.error("Error uploading logo:", error);
      return false;
    }

    return data.some((file) => file.name === name);
  }

  const fileExists = await checkIfLogoExists(fileName);
  if (!fileExists) {
    const { error: storageError } = await supabase.storage
      .from("company_logo")
      .upload(fileName, companyData.logo)
      .select();

    if (storageError) {
      console.log("error uploading logo", storageError);
      return null;
    }
  }

  const logo_url = `${config.supabaseUrl}/storage/v1/object/public/company_logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert({ name: companyData.name, logo_url })
    .select();

  if (error) {
    console.log("Error submitting comapny", error);
  }
  console.log(data);
  return data;
}
