package com.example.backend.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. 업로드용
        String externalUploadPath = "file:" + System.getProperty("user.home") + File.separator + "gym_uploads" + File.separator;

        registry.addResourceHandler("/images/**") //
                .addResourceLocations(externalUploadPath);

        // 2. 초기 데이터용
        String internalResourcePath = "classpath:/sources/";

        registry.addResourceHandler("/images-init/**") //
                .addResourceLocations(internalResourcePath);
    }
}
