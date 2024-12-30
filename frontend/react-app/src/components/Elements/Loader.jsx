const Loader = ({ className }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-200 border-t-blue-500 ${className}`}
      style={{ width: "24px", height: "24px" }}
    />
  );
};

export default Loader;
