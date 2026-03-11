package com.itcs383.restaurant.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for updating an existing menu item.
 * All fields are optional — only provided fields are applied.
 */
@Getter
@Setter
@NoArgsConstructor
public class UpdateMenuItemRequest {

    @Size(min = 2, max = 100, message = "Menu item name must be between 2 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    private Long categoryId;

    private Boolean isAvailable;
    private Boolean isFeatured;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private Boolean isGlutenFree;
    private Boolean isSpicy;

    @Min(value = 0, message = "Preparation time cannot be negative")
    @Max(value = 240, message = "Preparation time cannot exceed 240 minutes")
    private Integer preparationTime;

    @Min(value = 0, message = "Calories cannot be negative")
    private Integer calories;

    @Size(max = 200, message = "Ingredients list must not exceed 200 characters")
    private String ingredients;

    @Size(max = 200, message = "Allergens list must not exceed 200 characters")
    private String allergens;

    private Integer displayOrder;
}
