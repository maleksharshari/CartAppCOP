package com.bau.shoppingcartapi.entities;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.*;

@Document(collection = "reviews")  // MongoDB collection
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    private String id;  // MongoDB automatically generates the ID
    // Reference to User document (user who wrote the review)

    private String userId;
    private String productId;
    private String comment;// Comment for the review

}
