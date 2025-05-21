import React, { createContext, useState, useContext, useEffect } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  // Reset search when navigating to a new page
  useEffect(() => {
    const handlePopState = () => {
      setSearchTerm('');
      setIsSearching(false);
      setSearchResults([]);
      setCurrentResultIndex(0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Search the current page for matches
  const searchPage = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Get all text nodes in the document
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip script and style elements
          if (
            node.parentNode.tagName === 'SCRIPT' ||
            node.parentNode.tagName === 'STYLE' ||
            node.parentNode.classList.contains('navbar') ||
            node.parentNode.classList.contains('footer')
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Accept only nodes with non-empty text
          return node.textContent.trim() !== '' 
            ? NodeFilter.FILTER_ACCEPT 
            : NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    // Find matches in text nodes
    const results = [];
    const searchRegex = new RegExp(searchTerm, 'gi');
    
    textNodes.forEach(node => {
      const text = node.textContent;
      let match;
      
      while ((match = searchRegex.exec(text)) !== null) {
        results.push({
          node,
          index: match.index,
          text: match[0],
          nodeText: text
        });
      }
    });

    setSearchResults(results);
    setCurrentResultIndex(results.length > 0 ? 0 : -1);
    
    // Highlight first result if any found
    if (results.length > 0) {
      highlightResult(results[0], 0);
    }
  };

  // Navigate to next search result
  const nextResult = () => {
    if (searchResults.length === 0) return;
    
    const newIndex = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(newIndex);
    highlightResult(searchResults[newIndex], newIndex);
  };

  // Navigate to previous search result
  const prevResult = () => {
    if (searchResults.length === 0) return;
    
    const newIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentResultIndex(newIndex);
    highlightResult(searchResults[newIndex], newIndex);
  };

  // Highlight a specific search result
  const highlightResult = (result, index) => {
    // Remove previous highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
    
    // Create highlight for current result
    const { node, index: matchIndex, text } = result;
    const nodeText = node.textContent;
    
    // Split the text node into parts
    const before = nodeText.substring(0, matchIndex);
    const match = nodeText.substring(matchIndex, matchIndex + text.length);
    const after = nodeText.substring(matchIndex + text.length);
    
    // Create new nodes
    const beforeNode = document.createTextNode(before);
    const matchNode = document.createElement('span');
    matchNode.textContent = match;
    matchNode.className = 'search-highlight';
    matchNode.style.backgroundColor = '#FFFF00';
    matchNode.style.color = '#000000';
    const afterNode = document.createTextNode(after);
    
    // Replace the original node
    const parent = node.parentNode;
    parent.insertBefore(beforeNode, node);
    parent.insertBefore(matchNode, node);
    parent.insertBefore(afterNode, node);
    parent.removeChild(node);
    
    // Scroll to the highlighted element
    matchNode.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  // Clear search highlights
  const clearHighlights = () => {
    document.querySelectorAll('.search-highlight').forEach(el => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
  };

  // Close search and clear highlights
  const closeSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setSearchResults([]);
    setCurrentResultIndex(0);
    clearHighlights();
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        isSearching,
        setIsSearching,
        searchResults,
        currentResultIndex,
        searchPage,
        nextResult,
        prevResult,
        closeSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);

export default SearchContext; 