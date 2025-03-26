
import React from 'react';

interface MovieContentWrapperProps {
  children: React.ReactNode;
}

const MovieContentWrapper: React.FC<MovieContentWrapperProps> = ({ children }) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
      {children}
    </div>
  );
};

export default MovieContentWrapper;
