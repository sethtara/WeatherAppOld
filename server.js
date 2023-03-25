try {
    const express = require('express');
    const app = express();
  
    // Serve static files from the "public" directory
    app.use(express.static('public'));
  
    //extration of the citycodes from the cities.json
    const jsonData = require('./public/assets/cities.json');
  
    const cities = jsonData.List;
    const cityCodes = [];
    for (const element of cities) {
        // Extract the current city object from the List array and store it in a variable called city
        const city = element;
  
        // Push the CityCode property of the current city object into the cityCodes array
        cityCodes.push(city.CityCode);
    }
  
    app.get('/data', (req, res) => {
      res.json(cityCodes);
    });
    //localhost listning at port 3000
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
  } catch (error) {
    console.error(error);
  }
  