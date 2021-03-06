class MyQueryOptions {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // search products based on keywords
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // paginate products based on page number and limit number
  paginate() {
    const page = this.queryStr.page ? parseInt(this.queryStr.page) : 1;
    const limit = this.queryStr.limit ? parseInt(this.queryStr.limit) : 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = MyQueryOptions;

/*
 * // ! SEARCHING & SORTING PRODUCTS
 * // ? search products based on keywords [*IMPLEMENTED]
 * // ? paginate products based on page number and limit number [*IMPLEMENTED]
 * // ? sort products based on price (High to Low)
 * // ? sort products based on price (Low to High)
 * // ? sort products based on name (A to Z)
 * // ? sort products based on name (Z to A)
 * // ? sort products based on createdAt (Newest to Oldest)
 * // ? sort products based on createdAt (Oldest to Newest)
 * // ? sort products based on most rated products
 * // ? sort products based on most sold products
 *
 */
