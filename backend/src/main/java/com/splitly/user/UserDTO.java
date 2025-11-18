package com.splitly.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@Data
public class UserDTO {

    private UUID id;
    private String username;
    private String firstName;
    private  String lastName;
}
