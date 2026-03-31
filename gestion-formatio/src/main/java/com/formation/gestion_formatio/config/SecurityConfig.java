package com.formation.gestion_formatio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Désactive le CSRF pour les tests Postman
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Autorise TOUTES les requêtes sans authentification
                );

        return http.build();
    }
}
