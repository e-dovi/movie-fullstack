const getMovie = async (name) => {
  const url = `/get-movie/${name}`;

  try {
    const response = await fetch(url, { method: "GET" });

    // If server responds with an error status (4xx/5xx)
    if (!response.ok) {
      // Try to read server's JSON error message if available
      try {
        const errJson = await response.json();
        return { error: errJson.error || "Server error" };
      } catch {
        return { error: "Server error" };
      }
    }

    // Normal success case
    const data = await response.json();
    return data;

  } catch (error) {
    console.error(error);
    return { error: "Network error" };
  }
};

export default getMovie;
