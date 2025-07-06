package SAmple.Bloggr.blog.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET_KEY = "L/ltMEi8ZMYpEzGpOa0bES1H6SHR9tw3xDfA7g7Mtw9dyBp3bCEU3tUfpEDlYlUABKX6TY5J9Oa93GH9sbM6jw==\r\n"; // 64+ characters

    private static final long EXPIRATION_TIME = 86400000; // 1 day

    private static Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
}
