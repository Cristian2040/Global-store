
async function test() {
    try {
        const companyName = 'Coca Cola Conpany';
        const url = `http://localhost:5000/api/products?company=${encodeURIComponent(companyName)}`;

        console.log(`Requesting: ${url}`);

        const response = await fetch(url);
        const data = await response.json();

        console.log('Response Status:', response.status);
        console.log('Response Body Keys:', Object.keys(data));
        if (data.data) {
            console.log('Data type:', Array.isArray(data.data) ? 'Array' : typeof data.data);
            if (Array.isArray(data.data)) {
                console.log('Products found:', data.data.length);
                if (data.data.length > 0) {
                    console.log('First product:', data.data[0]);
                }
            } else if (data.data.products) {
                console.log('Products found (nested):', data.data.products.length);
            }
        }

        console.log('Full Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
