package com.bookstore.controller;

import com.bookstore.dto.BookRequest;
import com.bookstore.dto.BookResponse;
import com.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Books", description = "BMS-US-005 to BMS-US-009 — Catalog management. GET endpoints are public; POST/PUT/DELETE require an Admin token.")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @Operation(summary = "BMS-US-005: Add a new book (Admin only)")
    @PostMapping
    public ResponseEntity<BookResponse> addBook(@Valid @RequestBody BookRequest request) {
        BookResponse response = bookService.addBook(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "BMS-US-006: Update an existing book (Admin only)")
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable String id,
                                                   @Valid @RequestBody BookRequest request) {
        BookResponse response = bookService.updateBook(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "BMS-US-007: Delete a book (Admin only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "BMS-US-008: View all books (public)")
    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @Operation(summary = "View a single book's details (public)")
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable String id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @Operation(summary = "BMS-US-009: Search books by title, author, or ISBN (public)",
            description = "Leave 'query' empty or omit it to get the full catalog back.")
    @GetMapping("/search")
    public ResponseEntity<List<BookResponse>> searchBooks(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(bookService.searchBooks(query));
    }
}
