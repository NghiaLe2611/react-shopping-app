export const fetchProducts = async (requestConfig, applyData) => {

    try {
        const response = await fetch(requestConfig.url, {
            method: requestConfig.method ? requestConfig.medthod : 'GET',
            headers: requestConfig.header ? requestConfig.headers : {},
            body: requestConfig.body ? JSON.stringify(requestConfig.body) : null
        });

        if (!response.ok) {
            throw new Error('Fetch data failed !');
        }

        const data = await response.json();
        applyData(data); // callback returns data
    } catch (error) {
        console.log(error.message);
    }
}