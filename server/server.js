const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const app = express();

const API_URL = 'https://runsignup.com/rest/races';
const API_KEY = 'jbYGSeWZsYRkBpuqjDPfyyjM5KNh2e1H';

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['OPTIONS', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-key'],
}));
app.use(cookieParser());

// Get featured race by state
app.get('/api/featured-race', async (req, res) => {
  const { state } = req.query;

  if (!state) {
    return res.status(400).json({ error: 'State parameter is required' });
  }

  const url = `${API_URL}?format=json&results_per_page=10&api_key=${API_KEY}&state=${encodeURIComponent(state)}`; // Increase results per page if needed

  try {
    const config = {
      headers: {
        'x-api-key': API_KEY
      }
    };

    const response = await axios.get(url, config);
    const races = response.data.races || []; // Assuming the API returns an array of races

    if (races.length === 0) {
      return res.status(404).json({ error: 'No races found for the given state' });
    }

    // Select a random race from the array
    const randomIndex = Math.floor(Math.random() * races.length);
    const featuredRace = races[randomIndex];

    res.json({ race: featuredRace });
  } catch (error) {
    console.error('Error fetching featured race:', error);
    res.status(500).json({ error: 'Error fetching featured race' });
  }
});

// Find races by state/month/or distance
app.get('/api/find-races', async (req, res) => {
  const { state, month, min_distance, max_distance } = req.query;

  let url = `${API_URL}?format=json&results_per_page=100&api_key=${API_KEY}`;

  if (state) {
      url += `&state=${state}`;
  }
  if (month) {
      url += `&start_date=${month}-01`;
      url += `&end_date=${month}-31`; // assuming all months end on the 31st for simplicity
  }
  if (min_distance !== undefined) {
      url += `&min_distance=${min_distance}`;
  }
  if (max_distance !== undefined) {
      url += `&max_distance=${max_distance}`;
  }

  console.log(`Request URL: ${url}`);
  console.log(`State: ${state}`);
  console.log(`Month: ${month}`);
  console.log(`Min distance: ${min_distance}`);
  console.log(`Max distance: ${max_distance}`);

  try {
    const config = {
      headers: {
        'x-api-key': API_KEY
      }
    };
  
    let allRaces = [];
    let page = 1;
    let hasMoreRaces = true;
  
    while (hasMoreRaces) {
      const response = await axios.get(`${url}&page=${page}`, config);
      const races = response.data.races || [];
      allRaces = [...allRaces, ...races];
  
      if (races.length < 1000) {
        hasMoreRaces = false;
      } else {
        page++;
      }
    }
  
    // Filter by states if provided
    let filteredRaces = allRaces;
    if (state) {
      console.log(`Filtering races for states: ${state}`);
      const statesArray = Array.isArray(state) ? state : state.split(',');
      filteredRaces = allRaces.filter(race => statesArray.includes(race.race.address.state));
    }
  
    // Further filter by months if provided
    if (month) {
        console.log(`Filtering races for months: ${month}`);
        const monthsArray = Array.isArray(month) ? month : month.split(',');
        filteredRaces = filteredRaces.filter(race => {
          const raceMonth = new Date(race.race.next_date).getMonth() + 1; // Assuming next_date is a valid date string
          return monthsArray.includes(raceMonth.toString());
        });
      }
  
    res.json(filteredRaces);
  } catch (error) {
    console.error('Error fetching races:', error);
    res.status(500).json({ error: 'Error fetching races' });
  }
});

// Search for races by name 
app.get('/api/search-races', async (req, res) => {
  const { name } = req.query;

  if (!name) {
      return res.status(400).json({ error: 'Name query parameter is required' });
  }

  const url = `${API_URL}?format=json&results_per_page=200&api_key=${API_KEY}&name=${encodeURIComponent(name)}`;

  try {
      const response = await axios.get(url, {
          headers: {
              'x-api-key': API_KEY
          }
      });

      res.json(response.data);
  } catch (error) {
      console.error('Error fetching races:', error);
      res.status(500).json({ error: 'Error fetching races' });
  }
});

/*
// Get featured race by state
app.get('/api/featured-race', async (req, res) => {
    const { state } = req.query;
  
    if (!state) {
      return res.status(400).json({ error: 'State parameter is required' });
    }

    const url = `${API_URL}?format=json&results_per_page=1&api_key=${API_KEY}&state=${encodeURIComponent(state)}`;
  
    try {
      const config = {
        headers: {
          'x-api-key': API_KEY
        }
      };
  
      const response = await axios.get(url, config);
      const featuredRace = response.data.races[0]; // Assuming the API returns an array of races
  
      if (!featuredRace) {
        return res.status(404).json({ error: 'Featured race not found' });
      }
  
      res.json({ race: featuredRace });
    } catch (error) {
      console.error('Error fetching featured race:', error);
      res.status(500).json({ error: 'Error fetching featured race' });
    }
  });

// Find races by state/month/or distance
app.get('/api/find-races', async (req, res) => {
  const { state, month, min_distance, max_distance } = req.query;
  
  let url = `${API_URL}?format=json&results_per_page=100&api_key=${API_KEY}`;
  
  if (min_distance !== undefined) {
    url += `&min_distance=${min_distance}`;
  }
  if (max_distance !== undefined) {
    url += `&max_distance=${max_distance}`;
  }

  console.log(`Min distance: ${min_distance}`);
  console.log(`Max distance: ${max_distance}`);

  try {
    const config = {
      headers: {
        'x-api-key': API_KEY
      }
    };
  
    let allRaces = [];
    let page = 1;
    let hasMoreRaces = true;
  
    while (hasMoreRaces) {
      const response = await axios.get(`${url}&page=${page}`, config);
      const races = response.data.races || [];
      allRaces = [...allRaces, ...races];
  
      if (races.length < 1000) {
        hasMoreRaces = false;
      } else {
        page++;
      }
    }
  
    // Filter by states if provided
    let filteredRaces = allRaces;
    if (state) {
      console.log(`Filtering races for states: ${state}`);
      const statesArray = Array.isArray(state) ? state : state.split(',');
      filteredRaces = allRaces.filter(race => statesArray.includes(race.race.address.state));
    }
  
    // Further filter by months if provided
    if (month) {
        console.log(`Filtering races for months: ${month}`);
        const monthsArray = Array.isArray(month) ? month : month.split(',');
        filteredRaces = filteredRaces.filter(race => {
          const raceMonth = new Date(race.race.next_date).getMonth() + 1; // Assuming next_date is a valid date string
          return monthsArray.includes(raceMonth.toString());
        });
      }
  
    res.json(filteredRaces);
  } catch (error) {
    console.error('Error fetching races:', error);
    res.status(500).json({ error: 'Error fetching races' });
  }
});



// Search for races by name 
app.get('/api/search-races', async (req, res) => {
    const { name } = req.query;
  
    if (!name) {
      return res.status(400).json({ error: 'Name query parameter is required' });
    }
  
    const url = `${API_URL}?format=json&results_per_page=200&api_key=${API_KEY}&name=${encodeURIComponent(name)}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          'x-api-key': API_KEY
        }
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching races:', error);
      res.status(500).json({ error: 'Error fetching races' });
    }
  }); */

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



