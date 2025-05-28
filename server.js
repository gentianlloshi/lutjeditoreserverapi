const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const quotesFilePath = path.join(__dirname, 'quotes.json'); // Skedari yt JSON

// Endpoint qe perpiqet te imitoje strukturen qe pritet nga QuotableApi
app.get('/api/quotes', (req, res) => {
    fs.readFile(quotesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Gabim gjate leximit te quotes.json:", err);
            res.status(500).json({ error: 'Nuk mund te lexohej skedari i te dhenave.' });
            return;
        }

        try {
            const localData = JSON.parse(data);
            
            // Check if prayers array exists in the new structure
            if (!localData.prayers || !Array.isArray(localData.prayers)) {
                res.status(500).json({ error: 'Struktura e te dhenave nuk eshte e sakta.' });
                return;
            }

            // Transform prayers data to match QuotableApi format
            const resultsForQuotable = localData.prayers
                .filter(prayer => prayer.id && prayer.translation_al) // Filter out incomplete prayers
                .map(prayer => ({
                    id: prayer.id,
                    content: prayer.translation_al || prayer.arabic_text || '', // Use Albanian translation as content
                    author: prayer.source_type || 'Kuran', // Use source_type as author
                    // Additional fields that might be useful
                    tags: prayer.category_ids || [],
                    length: (prayer.translation_al || prayer.arabic_text || '').length,
                    // Extra prayer-specific data
                    title: prayer.title,
                    arabic_text: prayer.arabic_text,
                    transliteration: prayer.transliteration,
                    reference: prayer.reference,
                    notes: prayer.notes,
                    preamble_arabic: prayer.preamble_arabic,
                    preamble_transliteration: prayer.preamble_transliteration
                }));

            // Create response payload that mimics QuotableQuoteList
            const responsePayload = {
                count: resultsForQuotable.length,
                totalCount: resultsForQuotable.length,
                page: 1,
                totalPages: 1,
                lastItemIndex: resultsForQuotable.length > 0 ? resultsForQuotable.length : null,
                results: resultsForQuotable
            };

            res.status(200).json(responsePayload);

        } catch (parseError) {
            console.error("Gabim gjate parse-imit te JSON nga quotes.json:", parseError);
            res.status(500).json({ error: 'Gabim ne formatin e te dhenave JSON.' });
        }
    });
});

// New endpoint for categories
app.get('/api/categories', (req, res) => {
    fs.readFile(quotesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Gabim gjate leximit te quotes.json:", err);
            res.status(500).json({ error: 'Nuk mund te lexohej skedari i te dhenave.' });
            return;
        }

        try {
            const localData = JSON.parse(data);
            
            if (!localData.categories || !Array.isArray(localData.categories)) {
                res.status(500).json({ error: 'Kategorite nuk jane te disponueshme.' });
                return;
            }

            res.status(200).json({
                count: localData.categories.length,
                categories: localData.categories
            });

        } catch (parseError) {
            console.error("Gabim gjate parse-imit te JSON:", parseError);
            res.status(500).json({ error: 'Gabim ne formatin e te dhenave JSON.' });
        }
    });
});

// New endpoint for prayers by category
app.get('/api/prayers/category/:categoryId', (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    
    fs.readFile(quotesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Gabim gjate leximit te quotes.json:", err);
            res.status(500).json({ error: 'Nuk mund te lexohej skedari i te dhenave.' });
            return;
        }

        try {
            const localData = JSON.parse(data);
            
            if (!localData.prayers || !Array.isArray(localData.prayers)) {
                res.status(500).json({ error: 'Lutjet nuk jane te disponueshme.' });
                return;
            }

            // Filter prayers by category
            const filteredPrayers = localData.prayers.filter(prayer => 
                prayer.category_ids && prayer.category_ids.includes(categoryId) && prayer.translation_al
            );

            // Transform to QuotableApi format
            const resultsForQuotable = filteredPrayers.map(prayer => ({
                id: prayer.id,
                content: prayer.translation_al || prayer.arabic_text || '',
                author: prayer.source_type || 'Kuran',
                tags: prayer.category_ids || [],
                length: (prayer.translation_al || prayer.arabic_text || '').length,
                title: prayer.title,
                arabic_text: prayer.arabic_text,
                transliteration: prayer.transliteration,
                reference: prayer.reference,
                notes: prayer.notes,
                preamble_arabic: prayer.preamble_arabic,
                preamble_transliteration: prayer.preamble_transliteration
            }));

            const responsePayload = {
                count: resultsForQuotable.length,
                totalCount: resultsForQuotable.length,
                page: 1,
                totalPages: 1,
                lastItemIndex: resultsForQuotable.length > 0 ? resultsForQuotable.length : null,
                results: resultsForQuotable,
                categoryId: categoryId
            };

            res.status(200).json(responsePayload);

        } catch (parseError) {
            console.error("Gabim gjate parse-imit te JSON:", parseError);
            res.status(500).json({ error: 'Gabim ne formatin e te dhenave JSON.' });
        }
    });
});

// Endpoint baze per testim
app.get('/', (req, res) => {
    res.send(`
        <h1>Serveri API lokal (imitues) eshte aktiv!</h1>
        <h2>Endpointet e disponueshme:</h2>
        <ul>
            <li><a href="/api/quotes">/api/quotes</a> - Te gjitha lutjet</li>
            <li><a href="/api/categories">/api/categories</a> - Kategorite</li>
            <li>/api/prayers/category/{categoryId} - Lutjet sipas kategorise</li>
        </ul>
        <p>Tani perdor te dhenat e pasura te lutjeve nga quotes.json</p>
    `);
});

// Nis serverin
app.listen(PORT, '0.0.0.0', () => {
    const localIpAddress = '192.168.1.2'; // IP jote
    console.log(`-----------------------------------------------------`);
    console.log(`🚀 Serveri API lokal (imitues) po degjon ne porten ${PORT}`);
    console.log(`   Ky server perpiqet te ktheje JSON ne formatin qe pret QuotableQuoteList.`);
    console.log(`-----------------------------------------------------`);
    console.log(`➡️ Test ne Browser:`);
    console.log(`   http://localhost:${PORT}/api/quotes`);
    console.log(`   http://localhost:${PORT}/api/categories`);
    console.log(`   http://localhost:${PORT}/api/prayers/category/1`);
    console.log(`-----------------------------------------------------`);
    console.log(`📱 Perdore ne Aplikacionin Android:`);
    console.log(`   Sigurohu qe Retrofit baseUrl eshte: http://${localIpAddress}:${PORT}/`);
    console.log(`   Sigurohu qe @GET ne QuotableApi eshte per: "api/quotes"`);
    console.log(`-----------------------------------------------------`);
});