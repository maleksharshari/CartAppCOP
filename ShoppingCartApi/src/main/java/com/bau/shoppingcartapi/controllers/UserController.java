package com.bau.shoppingcartapi.controllers;

import com.bau.shoppingcartapi.dto.AddToCartOrFavDto;
import com.bau.shoppingcartapi.dto.CreateUserDto;
import com.bau.shoppingcartapi.dto.UserDto;
import com.bau.shoppingcartapi.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> userDto = userService.getAllUsers();
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody @Valid CreateUserDto createUserDto) {
        String message = userService.createUser(createUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }


    // Cart operations
    @PostMapping("/add/cart")
    public ResponseEntity<UserDto> addToCart(@RequestBody AddToCartOrFavDto favOrCartDto) {
        UserDto userDto = userService.addToCart(favOrCartDto);
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping("/remove/cart")
    public ResponseEntity<UserDto> removeFromCart(@RequestBody AddToCartOrFavDto favOrCartDto) {
        UserDto userDto = userService.removeFromCart(favOrCartDto);
        return ResponseEntity.ok(userDto);
    }

    // Favorites operations
    @PostMapping("/add/favorite")
    public ResponseEntity<UserDto> addToFavorites(@RequestBody AddToCartOrFavDto favOrCartDto) {
        UserDto userDto = userService.addToFavorites(favOrCartDto);
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping("/remove/favorite")
    public ResponseEntity<UserDto> removeFromFavorites(@RequestBody AddToCartOrFavDto favOrCartDto) {
        UserDto userDto = userService.removeFromFavorites(favOrCartDto);
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping("/{userId}/favorites/clear")
    public ResponseEntity<UserDto> clearFavorites(@PathVariable String userId) {
        UserDto userDto = userService.clearFavorites(userId);
        return ResponseEntity.ok(userDto);
    }
    @DeleteMapping("/{userId}/cart/clear")
    public ResponseEntity<UserDto> clearCart(@PathVariable String userId) {
        UserDto userDto = userService.clearCart(userId);
        return ResponseEntity.ok(userDto);
    }

}

