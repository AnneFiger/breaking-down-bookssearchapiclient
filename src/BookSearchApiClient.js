
var XMLHttpRequest = require('xhr2');

function BookSearchApiClient(format) {
  this.format = format;
}
BookSearchApiClient.prototype.buildBooksQuery = function (authorName, limit) {
  return {"method": "GET", "url": "http://api.book-seller-example.com/by-author?q="+authorName+"&limit="+limit+"&format="+this.format}
  //TODO split this with params
}

BookSearchApiClient.prototype.formatResponseResultsInJSON = function (xhrBooksResponse) {
  var json = JSON.parse(xhrBooksResponse.responseText);

  result = json.map(function (item) {
    return {
      title: item.book.title,
      author: item.book.author,
      isbn: item.book.isbn,
      quantity: item.stock.quantity,
      price: item.stock.price,
    };
  });
}

BookSearchApiClient.prototype.formatResponseResultsInXML = function(xhrBooksResponse) {
  var xml = xhrBooksResponse.responseXML;
  console.log(xml)
  result = xml.documentElement.childNodes.map(function (item) {
    return {
      title: item.childNodes[0].childNodes[0].nodeValue,
      author: item.childNodes[0].childNodes[1].nodeValue,
      isbn: item.childNodes[0].childNodes[2].nodeValue,
      quantity: item.childNodes[1].childNodes[0].nodeValue,
      price: item.childNodes[1].childNodes[1].nodeValue,
    };
  });   
}

BookSearchApiClient.prototype.handleResponse = function (xhr) {
  if (xhr.status == 200) {
    if (this.format == "json") {
    this.formatResponseResultsInJSON(xhr)
    } else if (this.format == "xml") {
     this.formatResponseResultsInXML(xhr)
    }
    return result;
  } else {
    return "Request failed.  Returned status of " + xhr.status;
  }
}

BookSearchApiClient.prototype.getBooksByAuthor = function (authorName, limit) {
  // var result = [];
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "http://api.book-seller-example.com/by-author?q=" +
      authorName +
      "&limit=" +
      limit +
      "&format=" +
      this.format
  );
  xhr.onload = function () {
    this.handleResponse(xhrResponse)
   
  };
  xhr.send();
};

module.exports = BookSearchApiClient;
