import React, { Component } from 'react';
class Scraper extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    return (
      <div className="wrapper">
        <br /><br />
        <div className="container">
          <div className="row">
            <div className="col-12">
            <h1 className="primary-heading text-center">Amazon Review Scraper</h1>
            </div>
          </div>
          <div className="row d-flex justify-content-center align-items-center mt-5">
            <div className="col-12 col-md-2 mb-4">
              <label for="url" className="form-label text-light m-0">Enter Product URL : </label>
            </div>
            <div className="col-12 col-md-4 mb-4">
              <input type="text" className="form-control" id="url"  />
            </div>
          </div>
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-12 col-md-2 mb-4">
              <label for="pages" className="form-label text-light m-0">Enter No. Pages : </label>
            </div>
            <div className="col-12 col-md-4 mb-4">
              <input type="text" className="form-control" id="pages" />
            </div>
          </div>
          <div className="row d-flex justify-content-center align-items-center">
            <button className="btn-custom-light">Get Reviews</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Scraper;

// https://www.youtube.com/watch?v=D9xiIZAPZUI