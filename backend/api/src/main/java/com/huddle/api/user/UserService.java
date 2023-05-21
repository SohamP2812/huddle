package com.huddle.api.user;

import com.huddle.api.session.SignupRequest;
import com.huddle.api.team.DbTeam;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.core.exceptions.ConflictException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

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

        return userRepository.save(dbUser);
    }

    public List<DbUser> getUsers(String username) {
        return userRepository.findByUsernameStartsWithIgnoreCase(username);
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
