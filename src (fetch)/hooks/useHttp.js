const apiUrl = 'https://learn-react-2816d-default-rtdb.firebaseio.com/';

export const fetchProducts = async (requestConfig, applyData) => {

    try {
        const response = await fetch(apiUrl + requestConfig.url, {
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