package com.revature.Services;


import com.revature.DAOs.ReimbursementDAO;
import com.revature.DAOs.UserDAO;
import com.revature.Models.DTOs.IncomingReimbursementDTO;
import com.revature.Models.Reimbursement;
import com.revature.Models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReimbursementService {

    private final ReimbursementDAO reimbursementDAO;
    private final UserDAO userDAO;

    @Autowired
    public ReimbursementService(ReimbursementDAO reimbursementDAO, UserDAO userDAO) {
        this.reimbursementDAO = reimbursementDAO;
        this.userDAO = userDAO;
    }

    public Reimbursement createReimbursement(IncomingReimbursementDTO reimbursement){
        Reimbursement newReimbursement = new Reimbursement();
        newReimbursement.setReimbursementID(0);

        Optional<User> currentUser = userDAO.findById(reimbursement.getUserID());
        if (currentUser.isEmpty()){
            throw new IllegalArgumentException("User not found. Please try again.");
        }
        else{
           newReimbursement.setUser(currentUser.get());
        }

        if (reimbursement.getAmount() <= 0){
            throw new IllegalArgumentException("Amount must be greater than 0.");
        }
        else{
            newReimbursement.setAmount(reimbursement.getAmount());
        }

        if(reimbursement.getTitle() == null || reimbursement.getTitle().isBlank()){
            throw new IllegalArgumentException("Title cannot be empty.");
        }
        else{
            newReimbursement.setTitle(reimbursement.getTitle());
        }

        if (reimbursement.getDescription() == null || reimbursement.getDescription().isBlank()){
            throw new IllegalArgumentException("Description cannot be empty.");
        }
        else{
            newReimbursement.setDescription(reimbursement.getDescription());
        }
        newReimbursement.setStatus("Pending");
        return reimbursementDAO.save(newReimbursement);
    }

    public List<Reimbursement> findReimbursements(String username){
            User currentUser = userDAO.findByUsername(username);
            if (currentUser.getRole().equals("Manager")){
                return reimbursementDAO.findAll();
            }
            else{
                return reimbursementDAO.findByUserUsername(username);
            }
    }

    public List<Reimbursement> findPendingReimbursements(int userID){
        Optional<User> currentUser = userDAO.findById(userID);
        if (currentUser.isEmpty()){
            throw new IllegalArgumentException("User not found. Please try again.");
        }
        else{
            if (currentUser.get().getRole().equals("Manager")){
                return reimbursementDAO.findByStatus("Pending");
            }
            else{
                return reimbursementDAO.findByUserUserIDAndStatus(userID, "Pending");
            }
        }
    }

    public Reimbursement resolveReimbursementStatus(int reimbursementID, String status){

        Reimbursement reimbursement = reimbursementDAO.findById(reimbursementID).orElseThrow(() ->{
            throw new IllegalArgumentException("Reimbursement not found.");
        });

        if  (reimbursement.getStatus().equals("Pending")){
            if (!status.equals("Approved") && !status.equals("Denied")){
                throw new IllegalArgumentException("Status must be either 'Approved' or 'Denied'.");
            }
            reimbursement.setStatus(status);
            return reimbursementDAO.save(reimbursement);
        }
        else{
            throw new IllegalArgumentException("Reimbursement has already been resolved.");
        }
    }

    public Reimbursement updateReimbursementDescription(String username, int reimbursementID, String description){

        if (description == null || description.isBlank()){
            throw new IllegalArgumentException("Description cannot be empty.");
        }

        Reimbursement reimbursement = reimbursementDAO.findById(reimbursementID).orElseThrow(() ->{
            throw new IllegalArgumentException("Reimbursement not found.");
        });

        if (!(reimbursement.getStatus().equals("Pending"))){
            throw new IllegalArgumentException("Reimbursement has already been resolved.");
        }

        User currentUser = userDAO.findByUsername(username);

        if (currentUser.getRole().equals("Manager") || currentUser.getUserID() == reimbursement.getUser().getUserID()){
            reimbursement.setDescription(description);
            return reimbursementDAO.save(reimbursement);
        }
        else{
            throw new IllegalArgumentException("User does not have permission to update this reimbursement.");
        }
    }
}
