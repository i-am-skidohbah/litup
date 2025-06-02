import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrums() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <div className="bg-gray-200 py-2 px-8 text-sm flex items-center gap-1">
      <Link to="/" className="text-gray-700 hover:underline">Home</Link>
      {pathnames.map((name, idx) => {
        const routeTo = '/' + pathnames.slice(0, idx + 1).join('/');
        const isLast = idx === pathnames.length - 1;
        return (
          <span key={routeTo} className="flex items-center gap-1">
            <span className="mx-1 text-gray-400">/</span>
            {isLast ? (
              <span className="text-red-600 font-semibold capitalize">{decodeURIComponent(name)}</span>
            ) : (
              <Link to={routeTo} className="text-gray-700 hover:underline capitalize">
                {decodeURIComponent(name)}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrums;