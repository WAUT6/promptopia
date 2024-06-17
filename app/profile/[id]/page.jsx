"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Profile from "@components/Profile";

const MyProfilePage = () => {
  return (
    <Suspense>
      <MyProfile />
    </Suspense>
  );
};

const MyProfile = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const username = searchParams.get("name");

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      await fetch(`/api/prompt/${post._id.toString()}`, { method: "DELETE" });
    }

    const filteredPosts = posts.filter((p) => p._id !== post._id);

    setPosts(filteredPosts);
  };

  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setPosts(data);
    };

    if (session?.user.id) {
      fetchPosts();
    }
  }, [session?.user.id]);

  return (
    <Profile
      name={username}
      desc="Welcome to my personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    ></Profile>
  );
};

export default MyProfilePage;
