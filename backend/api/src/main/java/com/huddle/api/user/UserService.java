package com.huddle.api.user;

import com.huddle.api.session.SignupRequest;
import com.huddle.api.team.DbTeam;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.core.admin.DiscordClient;
import com.huddle.core.email.EmailSender;
import com.huddle.core.exceptions.BadRequestException;
import com.huddle.core.exceptions.ConflictException;
import com.huddle.core.persistence.SessionWrapper;
import com.huddle.core.persistence.Transactor;
import com.huddle.core.storage.StorageProvider;
import org.hibernate.criterion.MatchMode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserService {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailSender emailSender;

    @Autowired
    DiscordClient discordClient;

    @Autowired
    StorageProvider storageProvider;

    @Autowired
    Transactor transactor;

    @Value("${discord.newUserUrl}")
    private String discordNewUserUrl;

    public DbUser createUser(SignupRequest signUpRequest) {
        DbUser dbUser = transactor.call(session -> {
                    if (existsByUsername(session, signUpRequest.getUsername())) {
                        throw new ConflictException("Username is already taken!");
                    }
                    if (existsByEmail(session, signUpRequest.getEmail())) {
                        throw new ConflictException("Email is already in use!");
                    }

                    return session.save(
                            new DbUser(
                                    signUpRequest.getFirstName(),
                                    signUpRequest.getLastName(),
                                    signUpRequest.getUsername(),
                                    signUpRequest.getEmail(),
                                    passwordEncoder.encode(signUpRequest.getPassword())
                            )
                    );
                }
        );

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

    public Boolean existsByUsername(
            SessionWrapper session,
            String username
    ) {
        return session.createCriteria(DbUser.class)
                .addEq("username", username)
                .exists();
    }

    public Boolean existsByEmail(
            SessionWrapper session,
            String email
    ) {
        return session.createCriteria(DbUser.class)
                .addEq("username", email)
                .exists();
    }

    public List<DbUser> getUsers(String username) {
        return transactor.call(session ->
                session.createCriteria(DbUser.class)
                        .addLike("username", username, MatchMode.START)
                        .list()
        );
    }

    public void resetPassword(
            HttpServletRequest request,
            ResetPasswordRequest resetPasswordRequest
    ) {
        transactor.call(session -> {
                    DbUser dbUser = getUserByEmail(resetPasswordRequest.getEmail());

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

                    return true;
                }
        );
    }

    public void createPasswordResetTokenForUser(DbUser dbUser, String token) {
        transactor.call(session -> {
                    session.save(
                            new DbPasswordResetToken(
                                    token,
                                    dbUser
                            )
                    );
                    return true;
                }
        );
    }

    public void setNewPassword(NewPasswordRequest newPasswordRequest) {
        transactor.call(session -> {
                    DbPasswordResetToken dbPasswordResetToken = getPasswordResetToken(newPasswordRequest.getToken());

                    final Calendar calendar = Calendar.getInstance();
                    if (dbPasswordResetToken.getExpiryDate().before(calendar.getTime())) {
                        throw new BadRequestException("This reset token is expired.");
                    }

                    DbUser dbUser = dbPasswordResetToken.getUser();

                    dbUser.setPassword(passwordEncoder.encode(newPasswordRequest.getPassword()));

                    session.update(dbUser);
                    session.delete(dbPasswordResetToken);

                    return true;
                }
        );
    }

    public DbPasswordResetToken getPasswordResetToken(String token) {
        return transactor.call(session ->
                session.createCriteria(DbPasswordResetToken.class)
                        .addEq("token", token)
                        .uniqueResult()
        );
    }

    public DbUser getUser(Long userId) {
        return transactor.call(session ->
                session.get(DbUser.class, userId)
        );
    }

    public DbUser getUserByEmailOrUsername(String identifier) {
        Pattern pattern = Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}");
        Matcher matcher = pattern.matcher(identifier);

        return matcher.matches() ? getUserByEmail(identifier) : getUserByUsername(identifier);
    }

    public DbUser getUserByUsername(String username) {
        return transactor.call(session ->
                session.createCriteria(DbUser.class)
                        .addEq("username", username)
                        .uniqueResult()
        );
    }

    public DbUser getUserByEmail(String email) {
        return transactor.call(session ->
                session.createCriteria(DbUser.class)
                        .addEq("email", email)
                        .uniqueResult()
        );
    }

    public DbUser updateUser(
            UserRequest userRequest,
            MultipartFile profilePictureImage,
            Long userId
    ) throws IOException {
        return transactor.call(session -> {
                    DbUser dbUser = getUser(userId);

                    dbUser.setFirstName(userRequest.getFirstName());
                    dbUser.setLastName(userRequest.getLastName());

                    if (profilePictureImage != null) {
                        String profilePicUrl = uploadImage(profilePictureImage);
                        dbUser.setProfilePictureUrl(profilePicUrl);
                    }

                    return session.update(dbUser);
                }
        );
    }

    public void deleteUser(Long userId) {
        transactor.call(session -> {
                    DbUser dbUser = getUser(userId);
                    session.delete(dbUser);
                    return true;
                }
        );
    }

    public List<DbTeam> getTeams(Long userId) {
        return transactor.call(session -> {
                    DbUser dbUser = getUser(userId);

                    return dbUser.getMemberTeams()
                            .stream()
                            .map(DbTeamMember::getTeam)
                            .toList();
                }
        );
    }

    public String uploadImage(MultipartFile file) {
        return storageProvider.putImage("users/profile-pictures", file);
    }
}
