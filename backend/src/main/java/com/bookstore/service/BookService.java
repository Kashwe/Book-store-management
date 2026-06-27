package com.bookstore.service;

import com.bookstore.dto.BookRequest;
import com.bookstore.dto.BookResponse;

public interface BookService {
    BookResponse addBook(BookRequest request);
    BookResponse updateBook(String id, BookRequest request);
}
