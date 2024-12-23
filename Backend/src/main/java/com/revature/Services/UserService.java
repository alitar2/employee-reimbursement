package com.revature.Services;


import com.revature.DAOs.ReimbursementDAO;
import com.revature.DAOs.UserDAO;
import com.revature.Models.DTOs.IncomingUserDTO;
import com.revature.Models.DTOs.OutgoingUserDTO;
import com.revature.Models.Reimbursement;
import com.revature.Models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserDAO userDAO;
    private final ReimbursementDAO reimbursementDAO;

    @Autowired
    public UserService(UserDAO userDAO, ReimbursementDAO reimbursementDAO) {
        this.userDAO = userDAO;
        this.reimbursementDAO = reimbursementDAO;
    }

    public OutgoingUserDTO registerUser(IncomingUserDTO user){
        User newUser = new User();
        newUser.setUserID(0);
        if (user.getFirstName() == null || user.getFirstName().isBlank()){
            throw new IllegalArgumentException("First name invalid");
        }
        else{
            newUser.setFirstName(user.getFirstName());
        }
        if (user.getLastName() == null || user.getLastName().isBlank()){
            throw new IllegalArgumentException("Last name invalid");
        }
        else{
            newUser.setLastName(user.getLastName());
        }
        if (user.getUsername() == null || user.getUsername().isBlank() || userDAO.findByUsername(user.getUsername()) != null){
            throw new IllegalArgumentException("Username invalid");
        }
        else{
            newUser.setUsername(user.getUsername());
        }
        if (user.getPassword() == null || user.getPassword().isBlank()){
            throw new IllegalArgumentException("Password invalid");
        }
        else{
            newUser.setPassword(user.getPassword());
        }
        if (user.getEmail() == null || user.getEmail().isBlank()){
            throw new IllegalArgumentException("Email invalid");
        }
        else{
            newUser.setEmail(user.getEmail());
        }
        if (user.getRole()==null || user.getRole().isBlank()){
            newUser.setRole("Employee");
        }
        else {
            if (!user.getRole().equals("Employee") && !user.getRole().equals("Manager")){
                throw new IllegalArgumentException("Role invalid");
            }
            else {
                newUser.setRole(user.getRole());
            }
        }
        newUser.setReimbursements(new ArrayList<Reimbursement>());
        User savedUser = userDAO.save(newUser);
        return new OutgoingUserDTO(savedUser.getUserID(), savedUser.getUsername(), savedUser.getFirstName(), savedUser.getLastName(), savedUser.getEmail(), savedUser.getRole());
    }

    public OutgoingUserDTO loginUser(String username, String password){
        User user = userDAO.findByUsername(username);
        if (user == null){
            throw new IllegalArgumentException("Credentials incorrect.");
        }
        if (!user.getPassword().equals(password)){
            throw new IllegalArgumentException("Credentials incorrect.");
        }
        return new OutgoingUserDTO(user.getUserID(), user.getUsername(),  user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole());
    }


    public List<User> findAllUsers(){
        return userDAO.findAll();
    }

    public OutgoingUserDTO updateUserRole(int updateID, String role){
        if (!role.equals("Employee") && !role.equals("Manager")){
            throw new IllegalArgumentException("Role invalid.");
        }

        User user = userDAO.findById(updateID).orElseThrow(() ->{
            throw new IllegalArgumentException("User to update not found.");
        });

        user.setRole(role);
        user = userDAO.save(user);
        return new OutgoingUserDTO(user.getUserID(), user.getUsername(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole());
    }

    public void deleteUser(int deleteID){
        User user = userDAO.findById(deleteID).orElseThrow(()->{
            throw new IllegalArgumentException("User to delete not found.");
        });
        userDAO.delete(user);
    }

}
