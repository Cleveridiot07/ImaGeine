import * as dotenv from "dotenv";
import { createError } from "../error.js";
import fetch from "node-fetch";

dotenv.config();

// Log the API key to verify it's being loaded correctly (remove this in production)
console.log('LIMEWIRE_API_KEY:', process.env.LIMEWIRE_API_KEY);

// Controller to generate Image
export const generateImage = async (req, res, next) => {
  try {
    const { prompt, negative_prompt, samples, quality, guidance_scale, aspect_ratio, style } = req.body;

    const apiKey = process.env.LIMEWIRE_API_KEY;

    if (!apiKey) {
      throw createError(401, 'API key is missing');
    }

    const response = await fetch('https://api.limewire.com/api/image/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Api-Version': 'v1',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        negative_prompt,
        samples: samples || 1,
        quality: quality || 'MID',
        guidance_scale: guidance_scale || 40,
        aspect_ratio: aspect_ratio || '1:1',
        style,
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        throw createError(response.status, 'Failed to parse error response: ' + responseText);
      }
      throw createError(response.status, errorData.detail || 'Unknown error occurred');
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      throw createError(500, 'Failed to parse JSON response: ' + responseText);
    }

    console.log(responseData);
    res.status(200).json({ photo: responseData });
  } catch (error) {
    console.error('Error in generateImage:', error);
    next(createError(error.status || 500, error.message || 'Internal Server Error'));
  }
};

