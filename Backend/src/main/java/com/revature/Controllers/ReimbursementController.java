package com.revature.Controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.revature.Aspects.ManagerOnly;
import com.revature.Models.DTOs.IncomingReimbursementDTO;
import com.revature.Models.Reimbursement;
import com.revature.Services.ReimbursementService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reimbursements")
@CrossOrigin(value = "http://localhost:5173", allowCredentials = "true")
public class ReimbursementController {

    private final ReimbursementService reimbursementService;

    @Autowired
    public ReimbursementController(ReimbursementService reimbursementService) {
        this.reimbursementService = reimbursementService;
    }

    @PostMapping
    public ResponseEntity<Reimbursement> createReimbursement(@RequestBody IncomingReimbursementDTO reimbursement){
        Reimbursement newReimbursement = this.reimbursementService.createReimbursement(reimbursement);
        return ResponseEntity.status(201).body(newReimbursement);
    }

    @GetMapping
    public ResponseEntity<List<Reimbursement>> getReimbursements(HttpSession session){
        String username = (String) session.getAttribute("username");
        List<Reimbursement> reimbursements = this.reimbursementService.findReimbursements(username);
        return ResponseEntity.status(200).body(reimbursements);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Reimbursement>> getPendingReimbursements(@RequestBody int userID){
        List<Reimbursement> reimbursements = this.reimbursementService.findPendingReimbursements(userID);
        return ResponseEntity.status(200).body(reimbursements);
    }


    @ManagerOnly
    @PatchMapping("/resolve/{reimbursementID}")
    public ResponseEntity<Reimbursement> resolveReimbursement(@PathVariable int reimbursementID, @RequestBody ObjectNode params){
        String status = params.get("status").asText();
        Reimbursement resolveReimbursement = this.reimbursementService.resolveReimbursementStatus(reimbursementID, status);
        return ResponseEntity.status(200).body(resolveReimbursement);
    }

    @PatchMapping("/update/{reimbursementID}")
    public ResponseEntity<Reimbursement> updateReimbursementDescription(@PathVariable int reimbursementID, @RequestBody ObjectNode params, HttpSession session){
        String username = (String) session.getAttribute("username");
        String description = params.get("description").asText();
        Reimbursement updatedReimbursement = this.reimbursementService.updateReimbursementDescription(username, reimbursementID, description);
        return ResponseEntity.status(200).body(updatedReimbursement);
    }
}
