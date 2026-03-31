package com.formation.gestion_formatio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.formation.entity")
public class GestionFormatioApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionFormatioApplication.class, args);
	}

}
