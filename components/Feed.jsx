"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        ></PromptCard>
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(() => {
      setSearchedResults(filterPrompts(e.target.value));
    }, 500);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setAllPosts(data);
    };
    fetchPosts();
  }, []);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");

    return allPosts.filter((post) => {
      return (
        regex.test(post.prompt) ||
        regex.test(post.tag) ||
        regex.test(post.creator.username)
      );
    });
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    setSearchedResults(filterPrompts(tagName));
  };

  return (
    <section className="feed">
      <form className=" relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={searchText ? searchedResults : allPosts}
        handleTagClick={handleTagClick}
      ></PromptCardList>
    </section>
  );
};
export default Feed;
