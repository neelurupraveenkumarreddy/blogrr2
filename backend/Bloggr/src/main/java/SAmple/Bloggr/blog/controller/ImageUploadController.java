package SAmple.Bloggr.blog.controller;

import com.cloudinary.Cloudinary;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    private final Cloudinary cloudinary;

    public ImageUploadController() {
        Dotenv dotenv = Dotenv.configure()
                              .directory("M:/blogrr/backend/Bloggr")
                              .filename((".env"))  // Explicitly set base path
                              .ignoreIfMalformed()
                              .ignoreIfMissing()
                              .load();

        String name = dotenv.get("CLOUDINARY_CLOUD_NAME");
        String key = dotenv.get("CLOUDINARY_API_KEY");
        String secret = dotenv.get("CLOUDINARY_API_SECRET");

        if (name == null || key == null || secret == null) {
            throw new IllegalStateException("❌ Cloudinary config missing from .env file. Make sure it's present and loaded correctly.");
        }

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", name);
        config.put("api_key", key);
        config.put("api_secret", secret);

        this.cloudinary = new Cloudinary(config);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("folder", "blog_images");

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String imageUrl = uploadResult.get("secure_url").toString();

            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Image upload failed: " + e.getMessage()));
        }
    }
}
