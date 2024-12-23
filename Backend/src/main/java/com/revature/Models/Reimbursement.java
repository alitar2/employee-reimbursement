package com.revature.Models;


import jakarta.persistence.*;
import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "reimbursements")
public class Reimbursement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reimbursementID;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private float amount;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name="userID")
    private User user;

    public Reimbursement() {
    }

    public Reimbursement(int reimbursementID, String title, String description, float amount, String status, User user) {
        this.reimbursementID = reimbursementID;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.status = status;
        this.user = user;
    }

    public int getReimbursementID() {
        return reimbursementID;
    }

    public void setReimbursementID(int reimbursementID) {
        this.reimbursementID = reimbursementID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Reimbursement{" +
                "reimbursementID=" + reimbursementID +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                ", status='" + status + '\'' +
                ", user=" + user +
                '}';
    }
}
