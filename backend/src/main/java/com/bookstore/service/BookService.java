package com.bookstore.service;
import com.bookstore.dto.BookRequest;
import com.bookstore.dto.BookResponse;
import java.util.List;
public interface BookService {
    BookResponse addBook(BookRequest request);
    BookResponse updateBook(String id, BookRequest request);
    //  Delete Book
    void deleteBook(String id);
    // View Books
    List<BookResponse> getAllBooks();
    BookResponse getBookById(String id);
    // Search Books
    List<BookResponse> searchBooks(String query);
}
