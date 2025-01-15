import toast from "react-hot-toast";

export async function makePostRequest(
  setLoading,
  endpoint,
  data,
  resourceName,
  reset
) {
  try {
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setLoading(false);
      toast.success(`New ${resourceName} Created Successfully`);
      reset();
    } else {
      // Extract error response body and show appropriate message
      const errorData = await response.json();
      setLoading(false);

      switch (response.status) {
        case 404:
          toast.error(errorData.message || `No ${resourceName} Found`);
          break;
        case 400:
          toast.error(errorData.message || "Bad Request");
          break;
        case 403:
          toast.error("You don't have permission to perform this action.");
          break;
        default:
          toast.error(errorData.message || "Something went wrong");
      }
    }
  } catch (error) {
    setLoading(false);
    console.error("Network error or unexpected issue:", error);
    toast.error(
      "Failed to update. Please check your connection or try again later."
    );
  }
}

export async function makePutRequest(
  setLoading,
  endpoint,
  data,
  resourceName,
  redirect,
  reset
) {
  try {
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      // console.log(response);
      setLoading(false);
      toast.success(`${resourceName} Updated Successfully`);
      redirect();
    } else {
      setLoading(false);
      const errorData = await response.json(); // Extract response body
      if (response.status === 404) {
        toast.error(errorData.message || `No ${resourceName} Found`);
      } else {
        toast.error(errorData.message || "Something Went Wrong");
      }
    }
  } catch (error) {
    setLoading(false);
    // console.log(error);
  }
}
