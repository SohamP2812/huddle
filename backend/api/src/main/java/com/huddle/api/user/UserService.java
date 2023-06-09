package com.huddle.api.user;

import com.huddle.api.session.SignupRequest;
import com.huddle.api.team.DbTeam;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.core.admin.DiscordClient;
import com.huddle.core.email.EmailSender;
import com.huddle.core.exceptions.BadRequestException;
import com.huddle.core.exceptions.ConflictException;
import com.huddle.core.storage.StorageProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailSender emailSender;

    @Autowired
    DiscordClient discordClient;

    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    StorageProvider storageProvider;

    @Value("${discord.newUserUrl}")
    private String discordNewUserUrl;

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
                passwordEncoder.encode(signUpRequest.getPassword())
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

        discordClient.sendMessage(
                discordNewUserUrl,
                String.format(
                        "New User Created:\nUsername: %s\nEmail: %s\nFirst Name: %s\nLast Name: %s",
                        dbUser.getUsername(),
                        dbUser.getEmail(),
                        dbUser.getFirstName(),
                        dbUser.getLastName()
                )
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

        dbUser.setPassword(passwordEncoder.encode(newPasswordRequest.getPassword()));

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

    public DbUser getUserByEmailOrUsername(String identifier) {
        Pattern pattern = Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}");
        Matcher matcher = pattern.matcher(identifier);

        return matcher.matches() ? getUserByEmail(identifier) : getUserByUsername(identifier);
    }

    public DbUser getUserByUsername(String email) {
        return userRepository.findByUsername(email)
                .orElseThrow(() -> new EntityNotFoundException("No user exists with this username."));
    }

    public DbUser getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("No user exists with this email."));
    }

    public DbUser updateUser(
            UserRequest userRequest,
            MultipartFile profilePictureImage,
            Long userId
    ) throws IOException {
        DbUser dbUser = getUser(userId);

        dbUser.setFirstName(userRequest.getFirstName());
        dbUser.setLastName(userRequest.getLastName());

        if (profilePictureImage != null) {
            String profilePicUrl = uploadImage(profilePictureImage);
            dbUser.setProfilePictureUrl(profilePicUrl);
        }

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

    public String uploadImage(MultipartFile file) throws IOException {
        return storageProvider.putImage("users/profile-pictures", file.getBytes());
    }
}
