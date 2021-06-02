import React, { Component } from 'react';
import { Form } from "reactstrap";
import axios from 'axios';

class Scraper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      pages: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleChange(event) {
    const target = event.target;
    const value = (target.type === 'checkbox') ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  onSubmit = (event) => {
    event.preventDefault();
    // console.log("URL : " + this.state.url + "\nPages : " + this.state.pages);
    this.summary();
    this.reviews();
  }
  summary = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/download-summary`, {
        params: {
          "url": this.state.url,
          "pages": this.state.pages
        }
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  reviews = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/download-csv-file`, {
        params: {
          "url": this.state.url,
          "pages": this.state.pages
        }
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };


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
          <Form onSubmit={this.onSubmit}>
            <div className="row d-flex justify-content-center align-items-center px-4 px-md-0 mt-5">
              <div className="col-12 col-md-2 mb-4">
                <label htmlFor="url" className="form-label text-light m-0">Enter Product URL : </label>
              </div>
              <div className="col-12 col-md-4 mb-4">
                <input type="text" className="form-control" id="url" name="url" value={this.state.url} onChange={this.handleChange} required />
              </div>
            </div>
            <div className="row d-flex justify-content-center align-items-center px-4 px-md-0">
              <div className="col-12 col-md-2 mb-4">
                <label htmlFor="pages" className="form-label text-light m-0">Enter No. Pages : </label>
              </div>
              <div className="col-12 col-md-4 mb-4">
                <input type="text" className="form-control" id="pages" name="pages" value={this.state.pages} onChange={this.handleChange} required />
              </div>
            </div>
            <div className="row d-flex justify-content-center align-items-center px-4 px-md-0">
              <button className="btn-custom-light">Get Reviews</button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}


export default Scraper;

// https://www.youtube.com/watch?v=D9xiIZAPZUI