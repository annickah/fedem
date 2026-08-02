<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class FirestoreRestService
{
    private string $baseUrl;

    public function __construct(
        private FirebaseService $firebaseService,
        private HttpClientInterface $httpClient,
        string $projectId = 'fedem-39ad1'
    ) {
        $this->baseUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents";
    }

    private function headers(): array
    {
        return ['Authorization' => 'Bearer ' . $this->firebaseService->getAccessToken()];
    }

    public function listDocuments(string $collection): array
    {
        $response = $this->httpClient->request('GET', "{$this->baseUrl}/{$collection}", [
            'headers' => $this->headers(),
        ]);
        $data = $response->toArray(false);
        return $data['documents'] ?? [];
    }

    public function createDocument(string $collection, array $fields): array
    {
        $response = $this->httpClient->request('POST', "{$this->baseUrl}/{$collection}", [
            'headers' => $this->headers(),
            'json' => ['fields' => $this->toFirestoreFields($fields)],
        ]);
        return $response->toArray();
    }

    public function updateDocument(string $collection, string $id, array $fields): array
    {
        $mask = implode('&', array_map(fn($k) => "updateMask.fieldPaths={$k}", array_keys($fields)));
        $response = $this->httpClient->request('PATCH', "{$this->baseUrl}/{$collection}/{$id}?{$mask}", [
            'headers' => $this->headers(),
            'json' => ['fields' => $this->toFirestoreFields($fields)],
        ]);
        return $response->toArray();
    }

    public function deleteDocument(string $collection, string $id): void
    {
        $this->httpClient->request('DELETE', "{$this->baseUrl}/{$collection}/{$id}", [
            'headers' => $this->headers(),
        ]);
    }

    private function toFirestoreFields(array $fields): array
    {
        $result = [];
        foreach ($fields as $key => $value) {
            if (is_null($value)) {
                $result[$key] = ['nullValue' => null];
            } elseif (is_bool($value)) {
                $result[$key] = ['booleanValue' => $value];
            } elseif (is_int($value)) {
                $result[$key] = ['integerValue' => (string)$value];
            } else {
                $result[$key] = ['stringValue' => (string)$value];
            }
        }
        return $result;
    }
}