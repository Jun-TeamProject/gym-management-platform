package com.example.backend.global.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {
//    private final String uploadDir = "src/main/resources/sources/";

    private final String uploadRoot = System.getProperty("user.home") + File.separator + "gym_uploads";

    public String storeFile(MultipartFile file) throws IOException {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = StringUtils.getFilenameExtension(originalFileName);
        String storedFileName = UUID.randomUUID().toString() + "." + extension;

        File directory = new File(uploadRoot + File.separator );
        if (!directory.exists()) {
            directory.mkdirs();
        }

        Path targetLocation = Paths.get(directory.getAbsolutePath() + File.separator + storedFileName);
        file.transferTo(targetLocation);

        return "/images/" + storedFileName;
    }
}
