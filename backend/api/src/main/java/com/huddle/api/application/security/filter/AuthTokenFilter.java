package com.huddle.api.application.security.filter;

import com.huddle.api.application.security.jwt.JwtUtils;
import com.huddle.api.user.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = jwtUtils.parseJwtFromCookie(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                Long userId = jwtUtils.getIdFromJwtToken(jwt);

                UserDetails userDetails = new UserDetails(userId);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        jwt,
                        null
                );
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            Cookie jwtTokenCookie = new Cookie("huddle_session", null);

            jwtTokenCookie.setMaxAge(0);
            jwtTokenCookie.setSecure(true);
            jwtTokenCookie.setHttpOnly(true);

            response.addCookie(jwtTokenCookie);

            return;
        }

        filterChain.doFilter(request, response);
    }
}
