import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author?.name || "Unknown author";
  return (
    <Link href={`/p/${post.id}`}>
      <a>
        <h2>{post.title}</h2>
        <small>By {authorName}</small>
        <ReactMarkdown source={post.content} />
        <style jsx>{`
          a {
            color: inherit;
            padding: 2rem;
            display: block;
            text-decoration: none;
          }
        `}</style>
      </a>
    </Link>
  );
};

export default Post;
