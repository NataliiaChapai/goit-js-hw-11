import apiSettings from './settings';
import axios from 'axios';
const { imagesApiUrl, imagesKey } = apiSettings;

const per_page = 40;
const parameters = 'image_type=photo&orientation=horizontal&safesearch=true';
const BASE_URL = `${imagesApiUrl}/?key=${imagesKey}&per_page=${per_page}&${parameters}`;

export const getImages = async (term, page) => {
  try {
  const response = await axios.get(`${BASE_URL}&q=${term}&page=${page}`);
  return await response.data;
  } catch (error) {
    console.log(error);
  }
}