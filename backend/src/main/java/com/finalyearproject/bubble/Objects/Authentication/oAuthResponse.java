package com.finalyearproject.bubble.Objects.Authentication;

    /*
    When the User logs in via Google oAuth, the Google oAuth API provides a  short-lived Authorization code.
    This Authorization code can be used to get :

    access_token : Used to get Google Account information
    refresh_token : Allows the User to gain a new access_token without requiring the User to log in again.
     */

    public class oAuthResponse {
            private final String access_token;
            private final String token_type;
            private final Integer expires_in;
            private final String scope;
            private final String id_token;
            private final String refresh_token;

            // Constructor
            public oAuthResponse(String refresh_token, String access_token, String token_type, Integer expires_in, String scope, String id_token) {
                this.refresh_token = refresh_token;
                this.access_token = access_token;
                this.token_type = token_type;
                this.expires_in = expires_in;
                this.scope = scope;
                this.id_token = id_token;
            }

            // Getters  (Immutable)
            public String getAccess_token() { return access_token; }
            public String getToken_type() { return token_type; }
            public Integer getExpires_in() { return expires_in; }
            public String getScope() { return scope; }
            public String getId_token() { return id_token; }
            public String getRefresh_token() { return refresh_token; }


    }
