package com.huddle.api.user;

import com.huddle.api.session.SignupRequest;
import com.huddle.api.team.DbTeam;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.core.email.EmailSender;
import com.huddle.core.exceptions.BadRequestException;
import com.huddle.core.exceptions.ConflictException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    EmailSender emailSender;

    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    public DbUser createUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new ConflictException("Username is already taken!");
        }

        if (userRepository.existsByEmailIgnoreCase(signUpRequest.getEmail())) {
            throw new ConflictException("Email is already in use!");
        }

        DbUser dbUser = new DbUser(
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword())
        );

        userRepository.save(dbUser);

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", dbUser.getFirstName());

        emailSender.sendNow(
                dbUser.getEmail(),
                "CreatedAccount",
                variables,
                "Welcome to Huddle!"
        );

        return dbUser;
    }

    public List<DbUser> getUsers(String username) {
        return userRepository.findByUsernameStartsWithIgnoreCase(username);
    }

    public void resetPassword(
            HttpServletRequest request,
            ResetPasswordRequest resetPasswordRequest
    ) {
        DbUser dbUser = userRepository.findByEmail(resetPasswordRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("No user exists with this email."));

        String token = UUID.randomUUID().toString();

        createPasswordResetTokenForUser(dbUser, token);

        Map<String, Object> variables = new HashMap<>();
        variables.put("name", dbUser.getFirstName());
        variables.put("token", token);
        variables.put("resetUrl", UriComponentsBuilder.fromUriString(request.getHeader("referer")).queryParam("token", token).build().toUri());

        emailSender.sendNow(
                dbUser.getEmail(),
                "ResetPassword",
                variables,
                "Reset Your Huddle Password"
        );
    }

    public void createPasswordResetTokenForUser(DbUser dbUser, String token) {
        DbPasswordResetToken dbPasswordResetToken = new DbPasswordResetToken(token, dbUser);
        passwordResetTokenRepository.save(dbPasswordResetToken);
    }

    public void setNewPassword(NewPasswordRequest newPasswordRequest) {
        DbPasswordResetToken dbPasswordResetToken = getPasswordResetToken(newPasswordRequest.getToken());

        final Calendar calendar = Calendar.getInstance();
        if (dbPasswordResetToken.getExpiryDate().before(calendar.getTime())) {
            throw new BadRequestException("This reset token is expired.");
        }

        DbUser dbUser = dbPasswordResetToken.getUser();

        dbUser.setPassword(encoder.encode(newPasswordRequest.getPassword()));

        userRepository.save(dbUser);

        passwordResetTokenRepository.delete(dbPasswordResetToken);
    }

    public DbPasswordResetToken getPasswordResetToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("This reset token is invalid."));
    }

    public DbUser getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));
    }

    public DbUser updateUser(
            UserRequest userRequest,
            Long userId
    ) {
        DbUser dbUser = getUser(userId);

        dbUser.setFirstName(userRequest.getFirstName());
        dbUser.setLastName(userRequest.getLastName());

        return userRepository.save(dbUser);
    }

    public void deleteUser(Long userId) {
        DbUser dbUser = getUser(userId);

        userRepository.delete(dbUser);
    }

    public List<DbTeam> getTeams(Long userId) {
        DbUser dbUser = getUser(userId);

        return dbUser.getMemberTeams()
                .stream()
                .map(DbTeamMember::getTeam)
                .toList();
    }
}
