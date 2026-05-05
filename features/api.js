import axios from 'axios';

// IMPORTANT: Replace with your actual Plant.id API key
// You can get this from https://plant.id/
const PLANT_ID_API_KEY = 'YOUR_PLANT_ID_API_KEY_HERE';

/**
 * Sends a base64 image to Plant.id API for identification.
 * @param {string} base64Image - Base64 encoded image string (e.g., "data:image/jpeg;base64,...")
 * @returns {Promise<Object>} Plant identification results
 */
export const identifyPlant = async (base64Image) => {
  try {
    const response = await axios.post(
      'https://api.plant.id/v2/identify',
      {
        images: [base64Image],
        // Request specific details as per requirements
        plant_details: ["common_names", "url", "wiki_description", "taxonomy", "edible_parts", "propagation_methods"]
      },
      {
        headers: {
          'Api-Key': PLANT_ID_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // Parse response to extract relevant information (name, species, etc.)
    const bestMatch = response.data.suggestions[0];
    
    if (!bestMatch) {
      throw new Error("No plant identified.");
    }

    // Note: Plant.id v2 does not provide explicit watering/sunlight frequency out of the box in the standard identify endpoint.
    // In a real production app, you might need to map the plant species to your own database, or use the Plant.id health/care endpoints if available in your tier.
    // For this prototype, we will return the identified data and mock the care instructions based on the species or use generic ones.
    
    return {
      name: bestMatch.plant_details?.common_names?.[0] || bestMatch.plant_name,
      species: bestMatch.plant_details?.taxonomy?.species || bestMatch.plant_name,
      probability: bestMatch.probability,
      description: bestMatch.plant_details?.wiki_description?.value || "No description available.",
      // Mocked care data as placeholder - replace with actual db lookup or premium API data
      watering: "Water every 1-2 weeks", 
      sunlight: "Bright, indirect light",
      rawDetails: bestMatch.plant_details
    };
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw new Error(error.response?.data?.message || "Failed to identify plant. Please try again.");
  }
};
