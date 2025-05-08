package com.bau.shoppingcartapi.entities;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.List;

@Document(collection = "users")  // MongoDB collection
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;  // MongoDB automatically generates the ID

    private String email;

    // Favorites (products user liked)
    @Field(targetType = FieldType.STRING)
    private List<String> favorites;

    // Cart (products user added to cart)
    @Field(targetType = FieldType.STRING)
    private List<String> cart;

    // Reviews written by the user
    @Field(targetType = FieldType.STRING)
    private List<String> reviews;
}
