package com.huddle.api.application.security.jwt;

import com.huddle.api.user.DbUser;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${huddle.app.jwtSecret}")
    private String jwtSecret;

    @Value("${huddle.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String parseJwtFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        if (request.getCookies().length == 0) return null;

        Optional<String> token = Arrays.stream(request.getCookies())
                .filter(cookie -> "huddle_session".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findAny();

        return token.orElse(null);

    }

    public String generateJwtToken(DbUser dbUser) {
        return Jwts
                .builder()
                .setSubject(dbUser.getId().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public Long getIdFromJwtToken(String token) {
        return Long.parseLong(
                Jwts
                        .parser()
                        .setSigningKey(jwtSecret)
                        .parseClaimsJws(token)
                        .getBody()
                        .getSubject()
        );
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}
