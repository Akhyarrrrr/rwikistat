"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { BiCommentDetail, BiLink } from "react-icons/bi";
import LikeButton from "@/components/LikeButton";
import Bookmark from "@/components/Bookmark";
import { ToastContainer, toast } from "react-toastify";
import { MdVerified } from "react-icons/md";
import config from "@/config.js";
import { getFirebaseIdTokenHeaders } from "@/lib/authHeaders";

interface ForumData {
  id: string;
  data: {
    email: string;
    topics: string;
    title: string;
    images: string[];
    likes: number;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
  };
  user: {
    displayName: string;
    photoURL: string;
    verified: boolean;
    email: string;
  };
  commentCount: number;
}

export default function Search() {
  useEffect(() => {
    document.title = "Search Forum | Rwikistat";
    return () => {};
  }, []);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ForumData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.API_URL}/api/forum/search?query=${query}`,
        { headers: getFirebaseIdTokenHeaders() }
      );
      const data = await response.json();
      setResults(data);
      setSearchExecuted(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-3/4 items-center justify-center mx-auto px-3">
      <div className="w-full shadow-md bg-white rounded-lg border mb-3">
        <div className=" w-full p-4 flex space-x-4">
          <input
            className="border rounded-md p-2 flex-1 border-gray-300"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="bg-[#00726B] text-white px-4 py-2 rounded-md text-sm"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {loading && <p className="text-center p-8 text-gray-700">Loading...</p>}

      {searchExecuted && results.length === 0 && !loading && (
        <p className="text-center text-gray-700">No matching data</p>
      )}

      {results.map((result) => (
        <div
          key={result.id}
          className=" items-start px-4 py-6 my-5 shadow-md rounded-lg outline-1 border"
        >
          <Link href={`userId/${result.data.email}`}>
            <div className="flex">
              <div className=" rounded-full mr-2">
                <Image
                  src={result.user.photoURL}
                  alt="Picture of the author"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>

              <div className="items-center justify-between">
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-gray-900 -mt-1">
                    {result.user.displayName}
                  </p>
                  {result.user.verified && (
                    <MdVerified
                      size={18}
                      className="mb-1 ml-1 text-[#00726B]"
                    />
                  )}
                </div>
                <p className="text-gray-700 text-sm">
                  {result.data.createdAt._seconds * 1000 >
                  new Date().getTime() - 7 * 24 * 60 * 60 * 1000 ? (
                    <TimeAgo
                      date={new Date(result.data.createdAt._seconds * 1000)}
                    />
                  ) : (
                    <span>
                      {new Date(
                        result.data.createdAt._seconds * 1000
                      ).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Link>
          <Link href={`/forum/${result.id}`}>
            <div className="my-3">
              <p className="text-gray-700 text-xl font-bold">
                {result.data.title}
              </p>
              <p className="text-gray-700">{result.data.topics}</p>
            </div>
          </Link>
          <hr />
          <div className=" mt-3 flex items-center">
            <div className="flex 2 text-gray-700 text-sm mr-3">
              <LikeButton itemId={result.id} />
              <span>{result.data.likes}</span>
            </div>
            <div className="flex  text-gray-700 text-sm mr-3">
              <BiCommentDetail size="20" />
              <span>{result.commentCount}</span>
            </div>
            <div className="flex  text-gray-700 text-sm mr-3">
              <Bookmark itemId={result.id} />
            </div>
            <div className="flex  text-gray-700 text-sm mr-3">
              <BiLink
                size="20"
                onClick={() => {
                  const linkElement = document.querySelector(
                    `a[href="/forum/${result.id}"]`
                  );
                  const link = (linkElement as HTMLAnchorElement).href;
                  if (link) {
                    navigator.clipboard.writeText(link);
                  }
                }}
              />
              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </div>
        </div>
      ))}
      {/* Hasil Seacrch Disini */}
    </div>
  );
}
