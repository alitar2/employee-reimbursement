package com.revature.Models.DTOs;

public class IncomingReimbursementDTO {

        private String title;
        private String description;
        private float amount;
        private int userID;


        public IncomingReimbursementDTO() {
        }

    public IncomingReimbursementDTO(String title, String description, float amount, int userID) {
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.userID = userID;
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



    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }
}
