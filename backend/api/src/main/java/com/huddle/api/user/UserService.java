package com.huddle.api.user;

import com.huddle.api.session.SignupRequest;
import com.huddle.api.team.DbTeam;
import com.huddle.api.teammember.DbTeamMember;
import com.huddle.core.exceptions.ConflictException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.List;
import java.util.Set;

public class UserService {
    @Autowired
    AuthenticationManager authenticationManager;

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

        dbUser = userRepository.save(dbUser);

        return dbUser;
    }

    public List<DbUser> getUsers(String username) {
        return userRepository.findByUsernameStartsWithIgnoreCase(username);
    }

    public DbUser getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));
    }

    public DbUser updateUser(
            @Valid @RequestBody UserRequest userRequest,
            @PathVariable Long id
    ) {
        DbUser dbUser = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        dbUser.setFirstName(userRequest.getFirstName());
        dbUser.setLastName(userRequest.getLastName());

        userRepository.save(dbUser);

        return dbUser;
    }

    public void deleteUser(
            @Valid @RequestBody DeleteUserRequest deleteUserRequest,
            @PathVariable Long id
    ) {
        DbUser dbUser = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        userRepository.delete(dbUser);
    }

    public List<DbTeam> getTeams(
            @PathVariable Long id
    ) {
        DbUser dbUser = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("No user exists with this id."));

        Set<DbTeamMember> memberTeams = dbUser.getMemberTeams();

        return memberTeams
                .stream()
                .map(DbTeamMember::getTeam)
                .toList();
    }
}
