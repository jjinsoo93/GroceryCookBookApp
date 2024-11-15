import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// Your Kroger credentials
const krogerClientId = 'jinsoopark-243261243034246d3466684f616675674f33456d615841664f413550654d30506e54694b4c6a544d41566d6b3254753139765a2e672f5367657745651076066335836988976';
const krogerClientSecret = '-Jw8AGwxpQUewQqX3jd1bW-rMPqVNGAOqriHRuHQ';

async function getKrogerAccessToken() {
    const tokenUrl = 'https://api.kroger.com/v1/connect/oauth2/token';
    const credentials = Buffer.from(`${krogerClientId}:${krogerClientSecret}`).toString('base64');
  
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        body: 'grant_type=client_credentials&scope=product.compact'
      });
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error fetching Kroger access token:', error);
    }
  }
  
  // Endpoint to fetch product data based on ingredient name
  app.get('/product', async (req, res) => {
    const ingredient = req.query.ingredient;
    const accessToken = await getKrogerAccessToken();
  
    if (!accessToken) {
      return res.status(500).json({ error: 'Could not retrieve access token' });
    }
  
    const url = `https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(ingredient)}&filter.limit=1`;
  
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching product data from Kroger:', error);
      res.status(500).json({ error: 'Failed to fetch product data' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });