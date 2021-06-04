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
      summaryMessage: "",
      reviewMessage: "",
      showTable: false,
      summaryData: {
        "five stars": "",
        "four stars": "",
        "number of global reviews and ratings": "",
        "one stars": "",
        "overall rating": "",
        "product name": "",
        "three stars": "",
        "two stars": "",
      },
      summaryFields: { fields: ["product name", "overall rating", "number of global reviews and ratings", "five stars", "four stars", "three stars", "two stars", "one stars"] },
      reviewsFields: { fields: ["date", "name", "title", "stars", "review"] }

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
    this.setState({ summaryMessage: "Please Wait !! Fetching Summary ....", reviewMessage: "Please Wait !! Scraping Reviews ...."});
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
        this.setState({ summaryData: res.data.message, showTable: true, summaryMessage: "The summary CSV file has been downloaded." });
        fileDownload(convert(res.data.message, this.state.summaryFields), "summary.csv");
        console.log(JSON.parse(JSON.stringify(res.data.message)));
      }
    } catch (err) {
      this.setState({ summaryMessage: "Error : Summary not Downloaded Try again !!" });
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
        this.setState({ reviewMessage: "The reviews CSV file has been downloaded." });
        fileDownload(convert(res.data.msg, this.state.reviewsFields), "reviews.csv");
        console.log(res.data.msg);
      }
    } catch (err) {
      this.setState({ reviewMessage: "Error : Reviews not Downloaded Try again !!" });
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
                >{this.state.summaryMessage}</label>
              </div>
            </div>
            <div className="row d-flex justify-content-center align-items-center px-4 px-md-0">
              <div className="col-12 col-md-6">
                <label htmlFor="pages" className="form-label m-0 text-center w-100"
                  style={{ color: "#61dafb" }}
                >{this.state.reviewMessage}</label>
              </div>
            </div>
            <br />
            <div className={(this.state.showTable) ? "" : "d-none"}>
              <div className="row d-flex justify-content-center align-items-center px-4 px-md-0">
                <div className="col-12 col-md-7">
                  <table class="table table-borderless table-light">
                    <thead>
                      <tr>
                        <th scope="col" colspan="2" className="text-center text-bold"><h4>Summary</h4></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Product Name</th>
                        <td>{this.state.summaryData['product name']}</td>
                      </tr>
                      <tr>
                        <th scope="row">Overall Rating</th>
                        <td>{this.state.summaryData['overall rating']}</td>
                      </tr>
                      <tr>
                        <th scope="row">Global Reviews</th>
                        <td>{this.state.summaryData['number of global reviews and ratings']}</td>
                      </tr>
                      <tr>
                        <th scope="row">Five Stars</th>
                        <td>{this.state.summaryData['five stars']}</td>
                      </tr>
                      <tr>
                        <th scope="row">Four Stars</th>
                        <td>{this.state.summaryData['four stars']}</td>
                      </tr>
                      <tr>
                        <th scope="row">Three Stars</th>
                        <td>{this.state.summaryData['three stars']}</td>
                      </tr>
                      <tr>
                        <th scope="row">Two Stars</th>
                        <td>{this.state.summaryData['two stars']}</td>
                      </tr>
                      <tr>
                        <th scope="row">One Stars</th>
                        <td>{this.state.summaryData['one stars']}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-center align-items-center px-4 px-md-0">
              <div className="col-12 col-md-7 form-label" style={{ color: "white", fontSize: "17px" }}>
                Note :-
                <p>1. Kindly add the URL of product after going to all reviews page of the product.</p>
                Example -
                <p className="dont-break-out">
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