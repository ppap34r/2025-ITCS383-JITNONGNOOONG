package com.itcs383.restaurant.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for creating a new menu item
 */
@Getter
@Setter
@NoArgsConstructor
public class CreateMenuItemRequest {

    @NotBlank(message = "Menu item name is required")
    @Size(min = 2, max = 100, message = "Menu item name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    private Long categoryId;

    private Boolean isAvailable = true;
    private Boolean isFeatured = false;
    private Boolean isVegetarian = false;
    private Boolean isVegan = false;
    private Boolean isGlutenFree = false;
    private Boolean isSpicy = false;

    @Min(value = 0, message = "Preparation time cannot be negative")
    @Max(value = 240, message = "Preparation time cannot exceed 240 minutes")
    private Integer preparationTime = 15;

    @Min(value = 0, message = "Calories cannot be negative")
    private Integer calories;

    @Size(max = 200, message = "Ingredients list must not exceed 200 characters")
    private String ingredients;

    @Size(max = 200, message = "Allergens list must not exceed 200 characters")
    private String allergens;

    private Integer displayOrder = 0;

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final CreateMenuItemRequest request = new CreateMenuItemRequest();

        public Builder name(String name) { request.name = name; return this; }
        public Builder description(String description) { request.description = description; return this; }
        public Builder price(BigDecimal price) { request.price = price; return this; }
        public Builder imageUrl(String imageUrl) { request.imageUrl = imageUrl; return this; }
        public Builder categoryId(Long categoryId) { request.categoryId = categoryId; return this; }
        public Builder isAvailable(Boolean isAvailable) { request.isAvailable = isAvailable; return this; }
        public Builder isFeatured(Boolean isFeatured) { request.isFeatured = isFeatured; return this; }
        public Builder isVegetarian(Boolean isVegetarian) { request.isVegetarian = isVegetarian; return this; }
        public Builder isVegan(Boolean isVegan) { request.isVegan = isVegan; return this; }
        public Builder isGlutenFree(Boolean isGlutenFree) { request.isGlutenFree = isGlutenFree; return this; }
        public Builder isSpicy(Boolean isSpicy) { request.isSpicy = isSpicy; return this; }
        public Builder preparationTime(Integer preparationTime) { request.preparationTime = preparationTime; return this; }
        public Builder calories(Integer calories) { request.calories = calories; return this; }
        public Builder ingredients(String ingredients) { request.ingredients = ingredients; return this; }
        public Builder allergens(String allergens) { request.allergens = allergens; return this; }
        public Builder displayOrder(Integer displayOrder) { request.displayOrder = displayOrder; return this; }

        public CreateMenuItemRequest build() { return request; }
    }
}
