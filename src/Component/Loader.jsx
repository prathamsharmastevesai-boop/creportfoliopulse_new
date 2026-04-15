import React from "react";
import "./LoaderCss.css";

const letters = [
  { char: "P", size: "fs-1" },
  { char: "o", size: "fs-2" },
  { char: "r", size: "fs-3" },
  { char: "t", size: "fs-4" },
  { char: "f", size: "fs-5" },
  { char: "o", size: "fs-4" },
  { char: "l", size: "fs-3" },
  { char: "i", size: "fs-2" },
  { char: "o", size: "fs-1" },
];

const RAGLoader = () => {
  return (
    <div className="rag-loader" aria-label="Loading Portfolio">
      {letters.map((item, index) => (
        <span
          key={index}
          className={`rag-letter ${item.size}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
};

export default RAGLoader;
