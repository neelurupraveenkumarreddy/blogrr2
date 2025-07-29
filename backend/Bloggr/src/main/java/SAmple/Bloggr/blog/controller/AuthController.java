package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.User;
import SAmple.Bloggr.blog.repository.UserRepository;
import SAmple.Bloggr.blog.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder; // BCrypt encoder

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        // Step 1: Find user by email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        // Step 2: Compare raw password with hashed password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        // Step 3: Generate token on successful login
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "token", token
        ));
    }
}
