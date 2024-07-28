const BookSearchApiClient = require('../src/BookSearchApiClient');

beforeAll(() => {
    bookSearchApiClient = new BookSearchApiClient("json");
  });

let open, send, onload, onerror;

function createXHRmock() {
    open = jest.fn()

    send = jest.fn().mockImplementation(function(){   
        onload = this.onload.bind(this);
        onerror = this.onerror.bind(this);
    });

    const xhrMockClass = function () {
        return {
            open,
            send
        };
    };

    global.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
}

describe('BookSearchApiClient', ()=> {
    it('it builds a get books by author query', () => {
        const authorName = 'Shakespeare'
        const limit = 10
        
        const expectedQuery = {
            method: 'GET',
            url: "http://api.book-seller-example.com/by-author?q=Shakespeare&limit=10&format=json"
        }
        expect(bookSearchApiClient.buildBooksQuery(authorName, limit)).toEqual(expectedQuery);
    });
    it('it format response results in json', () => {
        const dummyXhrBooksResponse = 
        {
            "status" : 200,
            "responseText": "[{\"book\":{\"title\":\"Macbeth\",\"author\":\"Shakespeare\",\"isbn\":\"ISBN0-061-96436-0\"},\"stock\":{\"quantity\":10,\"price\":5}},{\"book\":{\"title\":\"Othello\",\"author\":\"Shakespeare\",\"isbn\":\"ISBN0-061-96436-2\"},\"stock\":{\"quantity\":5,\"price\":10}}]"
        }
        const expectedResult = [
            {
            title: "Macbeth",
            author: "Shakespeare",
            isbn: "ISBN0-061-96436-0",
            quantity: 10,
            price: 5
            },
            {
            title: "Othello",
            author: "Shakespeare",
            isbn: "ISBN0-061-96436-2",
            quantity: 5,
            price: 10
            }
        ];
        
        expect(bookSearchApiClient.handleResponse(dummyXhrBooksResponse)).toEqual(expectedResult);
    });  
    // it('it format response results in xml', () => {
    //     const dummyXhrBooksResponse = 
    //     {
    //         "responseXML": './response.xml'
    //     }

    //     const expectedResult = [
    //         {
    //         title: "Macbeth",
    //         author: "Shakespeare",
    //         isbn: "ISBN0-061-96436-0",
    //         quantity: 10,
    //         price: 5
    //         },
    //         {
    //         title: "Othello",
    //         author: "Shakespeare",
    //         isbn: "ISBN0-061-96436-2",
    //         quantity: 5,
    //         price: 10
    //         }
    //     ];

    //     const bookSearchApiClient = new BookSearchApiClient("xml")

    //     expect(bookSearchApiClient.formatResponseResultsInXML(dummyXhrBooksResponse)).toEqual(expectedResult);
    // });  

    it('it handles API errors', () => {
        const dummyXhrResponse = 
        {
            "status" : 500
        }

        expect(bookSearchApiClient.handleResponse(dummyXhrResponse)).toEqual("Request failed.  Returned status of " + 500);
    }); 

    xit('it should send a xhr request successfully', () => {
        createXHRmock();
        bookSearchApiClient.getBooksByAuthor('Shakespeare', 10)
        expect(open).toBeCalledWith('GET', 'http://api.book-seller-example.com/by-author?q=Shakespeare&limit=10&format=json');
    }); 
})