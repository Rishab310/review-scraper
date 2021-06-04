import React, { Component } from 'react';
import { Form } from "reactstrap";
import axios from 'axios';
import fileDownload from 'js-file-download';

const JSONtoCSV = require("json2csv").parse;

const convert = (data, fields) => {
  const csv = JSONtoCSV(data, fields);
  return csv;
}
class Scraper extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      pages: null,
      message: "",
      summaryHeaders: {
        "product name": "Product Name",
        "overall rating": "Overall Rating",
        "number of global reviews and ratings": "GLobal Ratings",
        "five stars": "Five Star",
        "four stars": "Four Star",
        "three stars": "Three star",
        "two stars": "Two Star",
        "one stars": 'One Star',
      },
      summaryFields: { fields: ["product name", "overall rating", "number of global reviews and ratings", "five stars", "four stars", "three stars", "two stars", "one stars"] },
      reviewsFields: { fields: ["date", "name", "title", "stars", "review"]}

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
    this.setState({ message: "Please Wait !! Data is Scraping ...." });
    this.summary();
    this.reviews();
  }
  summary = async () => {
    try {
      const res = await axios.get(`https://review-scraper-server.herokuapp.com/download-summary`, {
        params: {
          "url": this.state.url,
          "pages": this.state.pages
        }
      });
      if (res.status === 200) {
        fileDownload(convert(res.data.message,this.state.summaryFields), "summary.csv");
        console.log(JSON.parse(JSON.stringify(res.data.message)));
      }
      // console.log(res);
    } catch (err) {
      this.setState({ message: "Error : Check the URL or network connection." });
      console.log(err);
    }
  };
  reviews = async () => {
    try {
      const res = await axios.get(`https://review-scraper-server.herokuapp.com/download-csv-file`, {
        params: {
          "url": this.state.url,
          "pages": this.state.pages
        }
      });
      
      if (res.status === 200) {
        this.setState({ message: "The summary and reviews CSV file has been downloaded." });
        fileDownload(convert(res.data.msg, this.state.reviewsFields), "reviews.csv");
        console.log(res.data.msg);
      }
    } catch (err) {
      this.setState({ message: "Error : Check the URL or network connection." });
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
            <br />
            <div className="row d-flex justify-content-center align-items-center px-4 px-md-0">
              <div className="col-12 col-md-6 mb-4">
                <label htmlFor="pages" className="form-label m-0 text-center w-100"
                  style={{ color: "#61dafb" }}
                >{this.state.message}</label>
              </div>
            </div>
            <div className="row d-flex justify-content-center align-items-center px-4 px-md-0">
              <div className="col-12 col-md-7 form-label" style={{ color:"white",fontSize:"17px"}}>
                Note :-
                <p>1. Kindly add the URL of product after going to all reviews page of the product.</p>
                Example - 
                <p>
                  https://www.amazon.in/Apple-MacBook-Pro-8th-Generation-Intel-Core-i5/product-reviews/B0883JQQJQ/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews
                </p>
                <p>2. Each page contains 9-10 reviews. Please enter number of pages accordingly.</p>
                <p>3. If both files are not downloaded at once, kindly try again !!</p>
              </div>
            </div>
          </Form>
          
        </div>
      </div>
    );
  }
}


export default Scraper;

// https://www.youtube.com/watch?v=D9xiIZAPZUI