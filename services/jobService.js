const axios = require("axios");

const getJobs = async (query) => {
  try {
    const response = await axios.get(
      "https://api.adzuna.com/v1/api/jobs/in/search/1",
      {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          what: query,
          where: "India",
          results_per_page: 5
        },
      }
    );

    console.log("Query:", query);
    console.log("Response count:", response.data.count);
    console.log("Jobs fetched:", response.data.results.length);
    return response.data.results;

  } catch (error) {
    console.error(
      "Job API error:",
      error.response?.data || error.message
    );
    return [];
  }
};

module.exports = getJobs;