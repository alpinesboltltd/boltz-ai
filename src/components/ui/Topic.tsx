import React from "react";
// import { IconType } from "@heroicons/react";

interface TopicProps {
  text: string;
  Icon: React.ElementType;
  className?: string;
}

const Topic: React.FC<TopicProps> = ({ text, Icon, className }) => {
  return (
    <div
      className={`inline-flex items-center px-4 py-2 bg-white shadow-md rounded-full gap-2 ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 text-blue-600" />}
      <span className="text-sm font-medium text-gray-800">{text}</span>
    </div>
  );
};

export default Topic;
