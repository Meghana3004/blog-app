import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { generateArchiveData } from '../utils/generateArchiveData';

export const useAllPosts = () => {
  const [state, setState] = useState({
    searchTerm: '',
    originalData: [],
    searchResults: [],
    selectedPost: null,
    showMoreMap: {},
    error: null,
    archiveData: {},
    totalPages: 1,
    currentPage: 1,
  });

  const fetchData = useCallback(async (page) => {
    try {
      const response = await axios.get(`/posts?page=${page}&lim=4`);
      setState(prevState => ({
        ...prevState,
        originalData: response.data.posts,
        searchResults: response.data.posts,
        archiveData: generateArchiveData(response.data.posts),
        totalPages: response.data.pages,
      }));
    } catch (error) {
      setState(prevState => ({ ...prevState, error: 'Error fetching data' }));
    }
  }, []);

  useEffect(() => {  
    fetchData(state.currentPage);
  }, [state.currentPage, fetchData]);

  const searchPosts = async () => {
    try {
      const response = await axios.get(`/search?term=${state.searchTerm}`);
      setState(prevState => ({ ...prevState, searchResults: response.data }));
    } catch (error) {
      setState(prevState => ({ ...prevState, error: 'Error searching' }));
    }
  };

  return { state, setState, fetchData, searchPosts };
};