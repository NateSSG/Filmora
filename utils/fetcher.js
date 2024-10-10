const fetcher = (url) => axios.get(url, {
    headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`
    }
}).then((res) => res.data).catch((error) => {
    console.error("Fetcher error:", error);
    throw error;
});
