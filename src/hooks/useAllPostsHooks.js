import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { generateArchiveData } from '../utils/generateArchiveData';

export const useAllPosts = () => {
  const [state, setState] = useState({
    searchTerm: '',
    appliedSearchTerm: '',
    categoryFilter: '',
    tagFilter: '',
    categories: [],
    tags: [],
    originalData: [],
    searchResults: [],
    selectedPost: null,
    showMoreMap: {},
    error: null,
    archiveData: {},
    totalPages: 1,
    currentPage: 1,
  });

  const fetchData = useCallback(async (page, filters) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        lim: '4',
      });
      if (filters.term) params.set('term', filters.term);
      if (filters.category) params.set('category', filters.category);
      if (filters.tag) params.set('tag', filters.tag);
      const response = await axios.get(`/posts?${params.toString()}`);
      setState(prevState => ({
        ...prevState,
        originalData: response.data.posts,
        searchResults: response.data.posts,
        archiveData: generateArchiveData(response.data.posts),
        totalPages: response.data.pages,
        error: null,
      }));
    } catch (error) {
      setState(prevState => ({ ...prevState, error: 'Error fetching posts' }));
      console.error('Error fetching posts:', error);
    }
  }, []);

  useEffect(() => {  
    fetchData(state.currentPage, {
      term: state.appliedSearchTerm,
      category: state.categoryFilter,
      tag: state.tagFilter,
    });
  }, [
    state.currentPage,
    state.appliedSearchTerm,
    state.categoryFilter,
    state.tagFilter,
    fetchData,
  ]);

  useEffect(() => {
    axios.get('/posts/taxonomy')
      .then((response) => {
        setState(prevState => ({
          ...prevState,
          categories: response.data.categories,
          tags: response.data.tags,
        }));
      })
      .catch((error) => {
        console.error('Error fetching post categories and tags:', error);
        setState(prevState => ({ ...prevState, error: 'Error loading post filters' }));
      });
  }, []);

  const searchPosts = () => {
    setState(prevState => ({
      ...prevState,
      appliedSearchTerm: prevState.searchTerm.trim(),
      currentPage: 1,
    }));
  };

  const clearFilters = () => {
    setState(prevState => ({
      ...prevState,
      searchTerm: '',
      appliedSearchTerm: '',
      categoryFilter: '',
      tagFilter: '',
      currentPage: 1,
    }));
  };

  const setFilter = (key, value) => {
    setState(prevState => ({
      ...prevState,
      [key]: value,
      currentPage: 1,
    }));
  };

  return { state, setState, searchPosts, clearFilters, setFilter };
};