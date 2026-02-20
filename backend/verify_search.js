const API_URL = 'http://localhost:5000/api/products';

async function runTests() {
    console.log('Starting API Verification...');
    let passed = 0;
    let failed = 0;

    const test = async (name, params, expectedCheck) => {
        try {
            const url = new URL(API_URL);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            const res = await fetch(url.toString());
            const data = await res.json();

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
            }

            if (expectedCheck(data)) {
                console.log(`[PASS] ${name}`);
                passed++;
            } else {
                console.log(`[FAIL] ${name}`);
                console.log('Response:', JSON.stringify(data, null, 2));
                failed++;
            }
        } catch (err) {
            console.log(`[FAIL] ${name} - Error: ${err.message}`);
            failed++;
        }
    };

    // 1. Simple Search
    await test('Simple Search (arduino)', { search: 'arduino' }, (data) => {
        return data.data.length > 0 && data.data.some(p => p.name.toLowerCase().includes('arduino'));
    });

    // 2. Empty Search
    await test('Empty Search', {}, (data) => {
        return data.data.length >= 10;
    });

    // 3. Category Filter
    await test('Category Filter (Electrónica)', { category: 'Electrónica' }, (data) => {
        return data.data.length > 0 && data.data.every(p => p.category === 'Electrónica');
    });

    // 4. Price Range
    await test('Price Range (100-200)', { min: 100, max: 200 }, (data) => {
        return data.data.length > 0 && data.data.every(p => p.price >= 100 && p.price <= 200);
    });

    // 5. Tags Filter
    await test('Tags Filter (ia)', { tags: 'ia' }, (data) => {
        return data.data.length > 0 && data.data.some(p => p.tags.includes('ia'));
    });

    // 6. Sorting (Price Asc)
    await test('Sort Price Asc', { sort: 'price_asc' }, (data) => {
        const prices = data.data.map(p => p.price);
        const sorted = [...prices].sort((a, b) => a - b);
        return JSON.stringify(prices) === JSON.stringify(sorted);
    });

    // 7. Pagination
    await test('Pagination Page 2', { page: 2, limit: 5 }, (data) => {
        return data.pagination.page === 2 && data.data.length > 0;
    });

    // 8. Zero Results
    await test('Zero Results', { search: 'xyz123nonexistent' }, (data) => {
        return data.data.length === 0;
    });

    // 9. Validating new fields existence
    await test('Fields Existence', { limit: 1 }, (data) => {
        const p = data.data[0];
        return p.description !== undefined && p.tags !== undefined && p.price !== undefined;
    });

    console.log(`\nTests Completed. Passed: ${passed}, Failed: ${failed}`);
}

runTests();
