<?php

namespace App\Service;

use Google\Auth\Credentials\ServiceAccountCredentials;

class FirebaseService
{
    private ServiceAccountCredentials $credentials;

    public function __construct()
    {
        $this->credentials = new ServiceAccountCredentials(
            'https://www.googleapis.com/auth/datastore',
            __DIR__ . '/../../config/firebase/firebase-credentials.json'
        );
    }

    public function getAccessToken(): string
    {
        $token = $this->credentials->fetchAuthToken();
        return $token['access_token'];
    }
}