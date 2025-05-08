package com.bau.shoppingcartapi.entities;

import org.springframework.cglib.core.FieldTypeCustomizer;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "products")  // MongoDB collection
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String id;  // MongoDB automatically generates the ID
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private String category;

    // Reference to Review documents in MongoDB

    @Field(targetType = FieldType.STRING)
    private List<String> reviews = new ArrayList<>();
}
