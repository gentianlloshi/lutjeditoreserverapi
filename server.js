const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const quotesFilePath = path.join(__dirname, 'quotes.json'); // Skedari yt JSON

// Endpoint qe perpiqet te imitoje strukturen qe pritet nga QuotableApi
// Sigurohu qe shtegu ketu ("/api/quotes") perputhet me ate qe perdor @GET ne QuotableApi
app.get('/api/quotes', (req, res) => {
    fs.readFile(quotesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Gabim gjate leximit te quotes.json:", err);
            res.status(500).json({ error: 'Nuk mund te lexohej skedari i citateve.' });
            return;
        }

        try {
            const localQuotesData = JSON.parse(data); // Ky eshte Array [...]

            // 1. Transformo te dhenat nga struktura jote lokale ne ate qe pret Androidi
            //    Supozojme se pret objekte me 'id', 'content', 'author' brenda 'results'
            const resultsForQuotable = localQuotesData.map(localQuote => ({
                id: localQuote.id, // Ose ndoshta _id nese API online e pret keshtu? Verifiko DTO/modelin ne Android
                content: localQuote.text,    // Mapo 'text' ne 'content'
                author: localQuote.source,   // Mapo 'source' ne 'author'
                // Mund te shtosh fusha te tjera qe pret modeli yt QuotableQuoteDto nese jane te nevojshme
                // p.sh., duke i lene boshe ose me vlera default:
                // tags: [],
                // length: localQuote.text.length,
                // translation: localQuote.translation // Nese e ke shtuar ne modelin e pritshem
            }));

            // 2. Krijo objektin e pergjigjes qe imiton QuotableQuoteList
          // ...
const responsePayload = {
    count: resultsForQuotable.length,
    totalCount: resultsForQuotable.length,
    page: 1,
    totalPages: 1,
    lastItemIndex: resultsForQuotable.length > 0 ? resultsForQuotable.length : null,
    results: resultsForQuotable // <-- FUSHA KYÇE
};
res.status(200).json(responsePayload); // <-- DËRGON OBJEKTIN
// ...

        } catch (parseError) {
            console.error("Gabim gjate parse-imit te JSON nga quotes.json:", parseError);
            res.status(500).json({ error: 'Gabim ne formatin e te dhenave JSON te citateve.' });
        }
    });
});

// Endpoint baze per testim
app.get('/', (req, res) => {
    res.send('Serveri API lokal (imitues) eshte aktiv! Endpointi kryesor: /api/quotes');
});

// Nis serverin
app.listen(PORT, '0.0.0.0', () => {
    const localIpAddress = '192.168.1.2'; // IP jote
    console.log(`-----------------------------------------------------`);
    console.log(`🚀 Serveri API lokal (imitues) po degjon ne porten ${PORT}`);
    console.log(`   Ky server perpiqet te ktheje JSON ne formatin qe pret QuotableQuoteList.`);
    console.log(`-----------------------------------------------------`);
    console.log(`➡️ Test ne Browser (do shfaqe strukturen e re):`);
    console.log(`   http://localhost:${PORT}/api/quotes`);
    console.log(`-----------------------------------------------------`);
    console.log(`📱 Perdore ne Aplikacionin Android (pa ndryshuar QuotableApi):`);
    console.log(`   Sigurohu qe Retrofit baseUrl eshte: http://${localIpAddress}:${PORT}/`);
    console.log(`   Sigurohu qe @GET ne QuotableApi eshte per: "api/quotes"`);
    console.log(`-----------------------------------------------------`);
});