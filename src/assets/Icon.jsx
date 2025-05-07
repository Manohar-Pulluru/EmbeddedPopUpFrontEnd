import React from "react";

const Icon = ({
  name,
  width = 24,
  height = 24,
  fill = "white",
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d={name} fill={fill} />
    </svg>
  );
};

export default Icon;
