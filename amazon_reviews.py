import scrapy
import subprocess


class AmazonReviewsSpider(scrapy.Spider):

    # Spider name
    name = "amazon_reviews"
    # Domain names to scrape
    allowed_domains = ["amazon.in"]
    start_urls = []
    page_no = 2

    def __init__(self, url="", page=2, *args, **kwargs):
        super(AmazonReviewsSpider, self).__init__(*args, **kwargs)
        # self.start_urls = [url]
        self.page_no = page

        # Base URL for the MacBook air reviews
        base_url = url + "&pageNumber="
        # myBaseUrl = input()
        # Baseurl will be input from user
        # start_urls = [myBaseUrl]
        # Creating list of urls to be scraped by appending page number a the end of base url
        # number of pages to be taken from user
        # print("\n \n \n \n         ",self.page_no,"\n BASE URL    ",base_url)
        for i in range(1, int(self.page_no) + 1):
            self.start_urls.append(base_url + str(i))
        
        # for _ in self.start_urls:
        #     print("URL \n",_)
    # Defining a Scrapy parser
    def parse(self, response):

        # print(self.url)
        # start_urls = []
        # for i in range(1, 2):
        #     start_urls.append(myBaseUrl + str(i))
        # print(self.url)
        data = response.css("#cm_cr-review_list")
        # Collecting product star ratings
        star_rating = data.css(".review-rating")
        # Collecting user reviews
        comments = data.css(".review-text-content")
        # reviewer name
        reviewerName = data.css(".a-profile-name")
        # review date
        date = data.css(".review-date")
        # review title
        title = data.css(".review-title")
        # number of helpful votes
        # helpfulVotes = data.css(".cr-vote-text")
        count = 0
        # Combining the results
        for review in star_rating:
            yield {
                "reviewerName": "".join(
                    reviewerName[count].xpath(".//text()").extract()
                ).strip(),
                "title": "".join(title[count].xpath(".//text()").extract()).strip(),
                "stars": "".join(review.xpath(".//text()").extract()).strip(),
                "comment": "".join(
                    comments[count].xpath(".//text()").extract()
                ).strip(),
                "date": "".join(date[count].xpath(".//text()").extract()).strip(),
                # "helpfulVotes": "".join(
                #     helpfulVotes[count].xpath(".//text()").extract()
                # ).strip(),
            }
            count = count + 1


# def scrape():
#     process = subprocess.run(f'scrapy runspider amazonReviews.py -o output.csv -a url={entry1.get()} -a page={}', shell= True)
# Command to run scrappy
# scrapy runspider amazon_reviews.py -o reviews.csv
