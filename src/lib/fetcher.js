// // export const fetcher = (url) => fetch(url).then((res) => res.json());

// // fetcher.js
// export const fetcher = async (url, options = {}) => {
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("An error occurred while fetching the data.");
//   }

//   return response.json();
// };

export const fetcher = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers, // Allow additional custom headers
      },
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        errorDetails.message || "An error occurred while fetching the data."
      );
    }

    return await response.json(); // Return parsed JSON response
  } catch (error) {
    console.error("Fetcher Error: ", error.message);
    throw error; // Re-throw the error to handle in SWR or other caller functions
  }
};
