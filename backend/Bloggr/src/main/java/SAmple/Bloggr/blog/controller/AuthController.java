package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.User;
import SAmple.Bloggr.blog.repository.UserRepository;
import SAmple.Bloggr.blog.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        User user = userRepository.findByEmailAndPassword(email, password);

        if (user != null) {
            String token = JwtUtil.generateToken(user.getEmail(), user.getRole());

            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "id",user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "token", token
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }
}
