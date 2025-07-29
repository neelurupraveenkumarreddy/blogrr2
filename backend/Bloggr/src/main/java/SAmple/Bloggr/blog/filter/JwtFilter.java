package SAmple.Bloggr.blog.filter;

import SAmple.Bloggr.blog.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Autowired
    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Add CORS headers for all responses
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Expose-Headers", "Authorization");

        // Bypass JWT check for preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String token = null;
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        String path = request.getRequestURI();

        // Validate token for secure endpoints
        if (path.startsWith("/api/secure")
                || path.startsWith("/api/categories/secure")
                || path.startsWith("/api/users/secure")
                || path.startsWith("/api/comments/secure")
                || path.startsWith("/api/profiles/secure")
                || path.startsWith("/api/posts/secure")) {

            // If token missing or invalid -> Unauthorized
            if (token == null || !jwtUtil.validateToken(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // Extract user info from token
            int userId = jwtUtil.extractUserId(token);
            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);

            // Attach attributes to request so controllers can use them
            request.setAttribute("userId", userId);
            request.setAttribute("email", email);
            request.setAttribute("role", role);

            // Enforce role check for admin-only endpoints
            if (path.startsWith("/api/users/secure")
                    || path.startsWith("/api/admin")
                    || path.startsWith("/api/categories/secure")) {
                if (!"ADMIN".equals(role)) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN); // Forbidden for non-admins
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
