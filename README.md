# Lutje Ditore Server API

A Node.js Express server providing an API for Albanian Islamic prayers, compatible with the QuotableAPI format for easy integration with mobile apps.

## Overview

This server provides access to 124 prayers (duas) in Albanian, Arabic, and transliteration format. It's designed specifically to work with Android applications expecting the QuotableAPI format while serving rich prayer content.

## Features

- **Rich Prayer Data**: Each prayer includes:
  - Albanian translation
  - Original Arabic text
  - Transliteration
  - Source reference (Quran or Sunnah)
  - Categories
  - Additional notes when available

- **Multiple Endpoints**:
  - `/api/quotes`: All prayers in QuotableAPI format
  - `/api/categories`: List of all prayer categories
  - `/api/prayers/category/:categoryId`: Prayers filtered by category

- **Mobile-Ready**: Designed to work with Android apps using Retrofit with minimal changes

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gentianlloshi/lutjeditoreserverapi.git
cd lutjeditoreserverapi
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

The server will start on port 3000 by default (configurable via PORT environment variable).

## API Usage

### Get All Prayers
```
GET /api/quotes
```

Example response:
```json
{
  "count": 124,
  "totalCount": 124,
  "page": 1,
  "totalPages": 1,
  "lastItemIndex": 124,
  "results": [
    {
      "id": 1,
      "content": ""Zoti ynë, ne i bëmë të padrejtë vetvetes, në qoftë se nuk na falë dhe nuk na mëshiron, ne me siguri do të jemi prej të shkatërruarve!"",
      "author": "Kuran",
      "tags": [1, 2, 4, 5, 6, 11],
      "length": 136,
      "title": "Lutje 1",
      "arabic_text": "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
      "transliteration": "Rabbena dhalemna enfusena ve in lem tagfirlena ve terhamna lenkunenne minel hasirin.",
      "reference": "Araf, 23",
      "notes": null,
      "preamble_arabic": "أَعُوذُ بِاللهِ مِنَ الشَّيطَانِ الرَّجِيمِ\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "preamble_transliteration": "Eudhu bil-lahi minesh shejtanir raxhim\nBismil-lahirr Rrahmanirr Rrahim"
    }
  ]
}
```

### Get All Categories
```
GET /api/categories
```

Example response:
```json
{
  "count": 15,
  "categories": [
    {
      "id": 1,
      "name": "Gjithë Lutjet",
      "description": "Të gjitha lutjet e disponueshme.",
      "icon": "layers"
    }
  ]
}
```

### Get Prayers by Category
```
GET /api/prayers/category/:categoryId
```

Example:
```
GET /api/prayers/category/4
```

Returns prayers that belong to category with ID 4, in the same format as the `/api/quotes` endpoint, plus a `categoryId` field.

## Android Integration

To use this API with an Android application:

1. Configure Retrofit with:
   ```kotlin
   // Replace with your server IP address if running locally
   baseUrl = "http://192.168.1.2:3000/"
   ```

2. Ensure your QuotableApi interface includes:
   ```kotlin
   @GET("api/quotes")
   suspend fun getQuotes(): Response<QuotableQuoteList>
   ```

3. Data classes should include the fields returned by the API.

## Data Structure

### Prayer Object
```json
{
  "id": 1,
  "title": "Lutje 1",
  "preamble_arabic": "أَعُوذُ بِاللهِ مِنَ الشَّيطَانِ الرَّجِيمِ\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "preamble_transliteration": "Eudhu bil-lahi minesh shejtanir raxhim\nBismil-lahirr Rrahmanirr Rrahim",
  "category_ids": [1, 2, 4, 5, 6, 11],
  "source_type": "Kuran",
  "arabic_text": "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
  "transliteration": "Rabbena dhalemna enfusena ve in lem tagfirlena ve terhamna lenkunenne minel hasirin.",
  "translation_al": ""Zoti ynë, ne i bëmë të padrejtë vetvetes, në qoftë se nuk na falë dhe nuk na mëshiron, ne me siguri do të jemi prej të shkatërruarve!"",
  "reference": "Araf, 23",
  "notes": null
}
```

### Category Object
```json
{
  "id": 1,
  "name": "Gjithë Lutjet",
  "description": "Të gjitha lutjet e disponueshme.",
  "icon": "layers"
}
```

## Development

- **Data Source**: Prayers are stored in `quotes.json`
- **Server**: Built with Express.js
- **API Format**: Compatible with QuotableAPI expected by the Android client

## License

ISC

## Author

Gentian Lloshi
