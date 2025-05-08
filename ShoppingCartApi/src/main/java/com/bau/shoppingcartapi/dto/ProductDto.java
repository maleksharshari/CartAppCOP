package com.bau.shoppingcartapi.dto;

import com.bau.shoppingcartapi.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private String id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private String category;
    private List <String> reviews = new ArrayList<>();
}