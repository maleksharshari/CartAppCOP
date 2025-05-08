package com.bau.shoppingcartapi.services;

import com.bau.shoppingcartapi.dto.AddToCartOrFavDto;
import com.bau.shoppingcartapi.dto.CreateUserDto;
import com.bau.shoppingcartapi.dto.UserDto;
import com.bau.shoppingcartapi.entities.Product;
import com.bau.shoppingcartapi.entities.User;
import com.bau.shoppingcartapi.repositories.ProductRepository;
import com.bau.shoppingcartapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setEmail(user.getEmail());
            userDto.setCart(user.getCart());
            userDto.setFavorites(user.getFavorites());
            return userDto;
        })
                .collect(Collectors.toList());
    }

 public UserDto getUserById(String id) {
     return userRepository.findById(id)
             .map(user -> {
                 UserDto userDto = new UserDto();
                 userDto.setId(user.getId());
                 userDto.setEmail(user.getEmail());
                 userDto.setCart(user.getCart());
                 userDto.setFavorites(user.getFavorites());
                 return userDto;
             })
             .orElseThrow(() -> new RuntimeException("User not found"));
 }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    public String createUser(CreateUserDto userDto) {
        // Check if user already exists
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new IllegalStateException("User with email " + userDto.getEmail() + " already exists");
        }

        try {
            // Create and initialize the user object
            User user = new User();
            user.setId(userDto.getId());
            user.setEmail(userDto.getEmail());
            user.setFavorites(new ArrayList<>());
            user.setCart(new ArrayList<>());
            // Save and return the new user
            userRepository.save(user);
            return "user has been created successfully";
        } catch (Exception e) {
            throw new RuntimeException("Failed to create user: " + e.getMessage(), e);
        }
    }


    public UserDto addToCart(AddToCartOrFavDto addToCart) {
        User user = userRepository.findById(addToCart.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getCart().add(addToCart.getProductId());
        userRepository.save(user);

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setCart(user.getCart());
        userDto.setFavorites(user.getFavorites());

        return userDto;
    }

    public UserDto removeFromCart(AddToCartOrFavDto rmCart) {
        User user = userRepository.findById(rmCart.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getCart().removeIf(product -> product.equals(rmCart.getProductId()));
        userRepository.save(user);

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setCart(user.getCart());
        userDto.setFavorites(user.getFavorites());

        return userDto;
    }


    // Favorites operations
    public UserDto addToFavorites(AddToCartOrFavDto addToFav) {
        User user = userRepository.findById(addToFav.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getFavorites().add(addToFav.getProductId());
        userRepository.save(user);

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setCart(user.getCart());
        userDto.setFavorites(user.getFavorites());

        return userDto;
    }

    public UserDto removeFromFavorites(AddToCartOrFavDto rmFav) {
        User user = userRepository.findById(rmFav.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getFavorites().removeIf(product -> product.equals(rmFav.getProductId()));
        userRepository.save(user);

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setCart(user.getCart());
        userDto.setFavorites(user.getFavorites());

        return userDto;
    }

    public UserDto clearCart(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setCart(new ArrayList<>());
        userRepository.save(user);

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setCart(user.getCart());
        userDto.setFavorites(user.getFavorites());

        return userDto;
    }
    public UserDto clearFavorites(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFavorites(new ArrayList<>());
        userRepository.save(user);

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setCart(user.getCart());
        userDto.setFavorites(user.getFavorites());

        return userDto;
    }
}
