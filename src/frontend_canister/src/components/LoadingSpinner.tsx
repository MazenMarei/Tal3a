function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center absolute w-full top-0 left-0 bg-black/30 h-full z-100 cursor-not-allowed">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default LoadingSpinner;
