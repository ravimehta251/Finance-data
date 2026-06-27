package com.finance.dashboard.security;

import com.finance.dashboard.entity.User;
import com.finance.dashboard.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Collection;

@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (user.getStatus() == User.UserStatus.INACTIVE) {
            throw new UsernameNotFoundException("User account is inactive: " + username);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                getAuthorities(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        // Add specific permission authorities based on role
        switch (user.getRole()) {
            case ADMIN:
                authorities.add(new SimpleGrantedAuthority("PERMISSION_READ_TRANSACTION"));
                authorities.add(new SimpleGrantedAuthority("PERMISSION_WRITE_TRANSACTION"));
                authorities.add(new SimpleGrantedAuthority("PERMISSION_DELETE_TRANSACTION"));
                authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_USERS"));
                authorities.add(new SimpleGrantedAuthority("PERMISSION_VIEW_ANALYTICS"));
                break;
            case ANALYST:
                authorities.add(new SimpleGrantedAuthority("PERMISSION_READ_TRANSACTION"));
                authorities.add(new SimpleGrantedAuthority("PERMISSION_WRITE_TRANSACTION"));
                authorities.add(new SimpleGrantedAuthority("PERMISSION_VIEW_ANALYTICS"));
                break;
            case VIEWER:
                authorities.add(new SimpleGrantedAuthority("PERMISSION_READ_TRANSACTION"));
                break;
        }

        return authorities;
    }
}
