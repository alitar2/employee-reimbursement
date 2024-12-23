package com.revature.Controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.revature.Aspects.ManagerOnly;
import com.revature.Models.DTOs.IncomingUserDTO;
import com.revature.Models.DTOs.OutgoingUserDTO;
import com.revature.Models.User;
import com.revature.Services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(value = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<OutgoingUserDTO> registerUser(@RequestBody IncomingUserDTO user){
        OutgoingUserDTO newUser = this.userService.registerUser(user);
        return ResponseEntity.status(201).body(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody ObjectNode params, HttpSession session){
        String username = params.get("username").asText();
        String password = params.get("password").asText();

        OutgoingUserDTO loggedInUser = this.userService.loginUser(username, password);
        session.setAttribute("userID", loggedInUser.getUserID());
        session.setAttribute("username", loggedInUser.getUsername());
        session.setAttribute("role", loggedInUser.getRole());

        return ResponseEntity.status(200).body(loggedInUser);
    }


    @ManagerOnly
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users = this.userService.findAllUsers();
        return ResponseEntity.status(200).body(users);
    }

    @ManagerOnly
    @DeleteMapping("/{deleteID}")
    public ResponseEntity<String> deleteUser(@PathVariable int deleteID){
        this.userService.deleteUser(deleteID);
        return ResponseEntity.status(204).body("User deleted");
    }

    @ManagerOnly
    @PatchMapping("/update-role/{updateID}")
    public ResponseEntity<OutgoingUserDTO> updateUserRole(@PathVariable int updateID, @RequestBody ObjectNode params){
        String role = params.get("role").asText();
        OutgoingUserDTO updatedUser = this.userService.updateUserRole(updateID, role);
        return ResponseEntity.status(200).body(updatedUser);
    }
}
