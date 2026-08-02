<?php

namespace App\Controller;

use App\Service\FirestoreRestService;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api')]
class ActualiteController extends AbstractController
{
    private const COLLECTION = 'actualites';

    public function __construct(
        private FirestoreRestService $firestore,
        #[Autowire(env: 'API_KEY')]
        private readonly string $apiKey
    ) {
    }

    private function checkApiKey(Request $request): bool
    {
        return $request->headers->get('X-API-KEY') === $this->apiKey;
    }

    private function docToArray(array $doc): array
    {
        $id = basename($doc['name']);
        $fields = [];
        foreach ($doc['fields'] ?? [] as $key => $value) {
            $fields[$key] = $value['stringValue']
                ?? $value['integerValue']
                ?? $value['booleanValue']
                ?? ($value['nullValue'] ?? null);
        }
        return array_merge(['id' => $id], $fields);
    }

    // ===============================
    // PUBLIC : Actualités publiées
    // ===============================
    #[Route('/actualites', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $docs = $this->firestore->listDocuments(self::COLLECTION);
        $actualites = array_map(fn($doc) => $this->docToArray($doc), $docs);
        $actualites = array_values(array_filter($actualites, fn($a) => ($a['statut'] ?? '') === 'publie'));
        usort($actualites, fn($a, $b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));

        return $this->json(['actualites' => $actualites], Response::HTTP_OK);
    }

    // ===============================
    // ADMIN : Toutes les actualités
    // ===============================
    #[Route('/admin/actualites', methods: ['GET'])]
    public function admin(Request $request): JsonResponse
    {
        if (!$this->checkApiKey($request)) {
            return $this->json(['success' => false, 'message' => 'Accès refusé.'], Response::HTTP_UNAUTHORIZED);
        }

        $docs = $this->firestore->listDocuments(self::COLLECTION);
        $actualites = array_map(fn($doc) => $this->docToArray($doc), $docs);
        usort($actualites, fn($a, $b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));

        return $this->json(['actualites' => $actualites], Response::HTTP_OK);
    }

    // ===============================
    // AJOUTER
    // ===============================
    #[Route('/actualites', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        if (!$this->checkApiKey($request)) {
            return $this->json(['success' => false, 'message' => 'Accès refusé.'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['titre']) || empty($data['contenu'])) {
            return $this->json(['success' => false, 'message' => 'Le titre et le contenu sont obligatoires.'], Response::HTTP_BAD_REQUEST);
        }

        $fields = [
            'titre' => $data['titre'],
            'contenu' => $data['contenu'],
            'resume' => $data['resume'] ?? '',
            'categorie' => $data['categorie'] ?? '',
            'tempsLecture' => $data['tempsLecture'] ?? '',
            'image' => $data['image'] ?? '',
            'statut' => 'brouillon',
            'createdAt' => (new \DateTimeImmutable())->format(DATE_ATOM),
        ];

        $result = $this->firestore->createDocument(self::COLLECTION, $fields);
        $actualite = $this->docToArray($result);

        return $this->json([
            'success' => true,
            'message' => 'Actualité créée avec succès.',
            'actualite' => $actualite,
        ], Response::HTTP_CREATED);
    }

    // ===============================
    // MODIFIER
    // ===============================
    #[Route('/actualites/{id}', methods: ['PUT'])]
    public function update(string $id, Request $request): JsonResponse
    {
        if (!$this->checkApiKey($request)) {
            return $this->json(['success' => false, 'message' => 'Accès refusé.'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $fields = [];

        foreach (['titre', 'contenu', 'resume', 'categorie', 'tempsLecture', 'image'] as $key) {
            if (isset($data[$key])) {
                $fields[$key] = $data[$key];
            }
        }

        if (empty($fields)) {
            return $this->json(['success' => false, 'message' => 'Aucune donnée à mettre à jour.'], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->firestore->updateDocument(self::COLLECTION, $id, $fields);
        $actualite = $this->docToArray($result);

        return $this->json([
            'success' => true,
            'message' => 'Actualité modifiée avec succès.',
            'actualite' => $actualite,
        ], Response::HTTP_OK);
    }

    // ===============================
    // PUBLIER
    // ===============================
    #[Route('/actualites/{id}/publier', methods: ['POST'])]
    public function publier(string $id, Request $request): JsonResponse
    {
        if (!$this->checkApiKey($request)) {
            return $this->json(['success' => false, 'message' => 'Accès refusé.'], Response::HTTP_UNAUTHORIZED);
        }

        $this->firestore->updateDocument(self::COLLECTION, $id, ['statut' => 'publie']);

        return $this->json(['success' => true, 'message' => 'Actualité publiée avec succès.']);
    }

    // ===============================
    // SUPPRIMER
    // ===============================
    #[Route('/actualites/{id}', methods: ['DELETE'])]
    public function delete(string $id, Request $request): JsonResponse
    {
        if (!$this->checkApiKey($request)) {
            return $this->json(['success' => false, 'message' => 'Accès refusé.'], Response::HTTP_UNAUTHORIZED);
        }

        $this->firestore->deleteDocument(self::COLLECTION, $id);

        return $this->json(['success' => true, 'message' => 'Actualité supprimée avec succès.']);
    }
}