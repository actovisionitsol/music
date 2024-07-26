import React from 'react';

const Navbar = ({ keyword, setKeyword, handleKeyPress, fetchMusicData }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Music Search</a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search for songs"
              aria-label="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={fetchMusicData}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
