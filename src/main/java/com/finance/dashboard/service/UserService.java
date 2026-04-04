package com.finance.dashboard.service;

import com.finance.dashboard.dto.UserCreationDTO;
import com.finance.dashboard.dto.UserDTO;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.entity.User.UserRole;
import com.finance.dashboard.entity.User.UserStatus;
import com.finance.dashboard.exception.BadRequestException;
import com.finance.dashboard.exception.ResourceNotFoundException;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO createUser(UserCreationDTO userCreationDTO) {
        if (userRepository.existsByUsername(userCreationDTO.getUsername())) {
            throw new BadRequestException("Username already exists: " + userCreationDTO.getUsername());
        }

        if (userRepository.existsByEmail(userCreationDTO.getEmail())) {
            throw new BadRequestException("Email already exists: " + userCreationDTO.getEmail());
        }

        try {
            User user = User.builder()
                    .username(userCreationDTO.getUsername())
                    .email(userCreationDTO.getEmail())
                    .password(passwordEncoder.encode(userCreationDTO.getPassword()))
                    .fullName(userCreationDTO.getFullName())
                    .role(UserRole.valueOf(userCreationDTO.getRole().toUpperCase()))
                    .status(UserStatus.ACTIVE)
                    .build();

            return mapToDTO(userRepository.save(user));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + userCreationDTO.getRole());
        }
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (!user.getUsername().equals(userDTO.getUsername()) && 
            userRepository.existsByUsername(userDTO.getUsername())) {
            throw new BadRequestException("Username already exists: " + userDTO.getUsername());
        }

        if (!user.getEmail().equals(userDTO.getEmail()) && 
            userRepository.existsByEmail(userDTO.getEmail())) {
            throw new BadRequestException("Email already exists: " + userDTO.getEmail());
        }

        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setFullName(userDTO.getFullName());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.getStatus());

        return mapToDTO(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setStatus(UserStatus.DELETED);
        userRepository.save(user);
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
