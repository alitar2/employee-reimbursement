package com.revature.DAOs;

import com.revature.Models.Reimbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReimbursementDAO extends JpaRepository<Reimbursement,Integer> {

    public List<Reimbursement> findByUserUsername(String username);

    public List<Reimbursement> findByUserUserID(int userID);

    public List<Reimbursement> findByStatus(String status);

    public List<Reimbursement> findByUserUsernameAndStatus(String username, String status);

    public List<Reimbursement> findByUserUserIDAndStatus(int userID, String status);
}
