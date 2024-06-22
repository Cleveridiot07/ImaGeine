import axios from "axios";

// Setup axios instance
const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

// Function to generate image from prompt
export const GenerateImageFromPrompt = async (data) => {
  try {
    const response = await API.post("/generateImage/", data);
    return response.data; // Ensure this returns the correct response data
  } catch (error) {
    console.error("Error generating image from prompt:", error);
    throw error;
  }
};

// Other API functions
export const GetPosts = async () => await API.get("/post/");
export const CreatePost = async (data) => await API.post("/post/", data);
