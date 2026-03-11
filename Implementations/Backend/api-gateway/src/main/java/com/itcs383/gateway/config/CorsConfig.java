package com.itcs383.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * CORS Configuration for API Gateway
 * 
 * Configures Cross-Origin Resource Sharing (CORS) to allow frontend applications
 * running on different ports/domains to access the backend APIs.
 * 
 * This configuration is critical for connecting the React frontend (port 5173)
 * to the Spring Boot backend (port 8080).
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allow credentials (cookies, authorization headers, etc.)
        corsConfig.setAllowCredentials(true);
        
        // Allowed origins - Frontend URLs
        corsConfig.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*",           // Development - any localhost port
            "http://127.0.0.1:*",           // Development - IP address
            "https://mhar-rueng-sang.com",  // Production domain
            "https://*.mhar-rueng-sang.com" // Production subdomains
        ));
        
        // Allowed HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList(
            "GET", 
            "POST", 
            "PUT", 
            "DELETE", 
            "PATCH", 
            "OPTIONS"
        ));
        
        // Allowed headers
        corsConfig.setAllowedHeaders(Arrays.asList(
            "Origin",
            "Content-Type",
            "Accept",
            "Authorization",
            "X-Requested-With",
            "X-Auth-Token",
            "X-CSRF-Token",
            "X-User-Id",
            "X-User-Role"
        ));
        
        // Exposed headers - headers that frontend can read
        corsConfig.setExposedHeaders(Arrays.asList(
            "Authorization",
            "X-Total-Count",
            "X-Page-Number",
            "X-Page-Size",
            "Content-Disposition"
        ));
        
        // How long the response from a pre-flight request can be cached (in seconds)
        corsConfig.setMaxAge(3600L);
        
        // Apply CORS configuration to all routes
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}
