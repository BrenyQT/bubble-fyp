package com.finalyearproject.bubble.Objects.WorkspaceChat;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;
import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL) // check for non null only lets non null fields translate to JSON dirty fix for my parsing issue
public class MessageDTO implements Serializable {
    private int id;
    private String senderId;
    private String senderName;
    private String senderEmail;
    private String senderPicture;
    private String content;
    private Date timestamp;
    private int workspaceId;

    public MessageDTO() {}

    public MessageDTO(int id, String senderId, String senderName, String senderEmail, String senderPicture,
                      String content, Date timestamp, int workspaceId) {
        this.id = id;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.senderPicture = senderPicture;
        this.content = content;
        this.timestamp = timestamp;
        this.workspaceId = workspaceId;
    }
    //getters setters
    public void setId(int id) {
        this.id = id;
    }

    public void setWorkspaceId(int workspaceId) {
        this.workspaceId = workspaceId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public void setSenderPicture(String senderPicture) {
        this.senderPicture = senderPicture;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public int getId() {
        return id;
    }

    public int getWorkspaceId() {
        return workspaceId;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public String getSenderPicture() {
        return senderPicture;
    }

    public String getContent() {
        return content;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getSenderId() {
        return senderId;
    }
}
