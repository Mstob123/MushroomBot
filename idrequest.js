const axios = require('axios');
const sharp = require('sharp');

// Define a function for making the POST request
async function makePostRequest(images) {
  const url = 'https://mushroom.kindwise.com/api/v1/identification'; // Replace with your API endpoint

  // Prepare the data object


  const data = {
    images: images,
  };

  // Custom headers
  const headers = {
    'Api-Key': process.env.ID_API_KEY, // Replace with your authorization token
    'Content-Type': 'application/json', // Specify the content type
  };

  try {
    const response = await axios.post(url, data, { headers });

    // Check if the response contains a result property
    if (response.data && response.data.result) {
      const result = response.data.result;
      console.log('Result:', result);
      return result;
    } else {
      console.log('Response does not contain a result section.');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function fetchImageAndConvertToBase64(imageUrl) {
    try {
      // Fetch the image data
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  
      // Convert the binary image data to a base64-encoded string
      const base64String = btoa(
        String.fromCharCode.apply(null, new Uint8Array(response.data))
      );
  
      return base64String;
    } catch (error) {
      console.error('Error fetching or converting image:', error);
      return null;
    }
  }

  async function fetchImageAndConvertToBase64too(imageUrl, maxWidth, maxHeight) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  
      // Convert the binary image data to a base64-encoded string
      const base64String = await sharp(response.data)
        .resize({
          width: maxWidth,   // Maximum width (optional)
          height: maxHeight, // Maximum height (optional)
          fit: 'inside',     // Resize the image to fit within maxWidth and maxHeight
        })
        .toBuffer()
        .then(data => data.toString('base64'));
  
      return base64String;
    } catch (error) {
      console.error('Error fetching or converting image:', error);
      return null;
    }
  }


  module.exports = {
    makePostRequest,
    fetchImageAndConvertToBase64,
    fetchImageAndConvertToBase64too,
  };


  fetchImageAndConvertToBase64('https://cdn.discordapp.com/attachments/1146886366353948753/1148859516834816020/IMG_3160.JPG')
  .then(result => {
    if (result) {
      console.log(result)
    } else {
      // Handle the case where there is no result
    }
  })
  .catch(error => {
    // Handle any errors here
  });

  