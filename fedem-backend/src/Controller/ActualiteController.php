<?php

namespace App\Controller;

use App\Entity\Actualite;
use App\Repository\ActualiteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class ActualiteController extends AbstractController
{
    public function __construct(
        #[Autowire(env: 'API_KEY')]
        private readonly string $apiKey
    ) {
    }

    private function checkApiKey(Request $request): bool
    {
        return $request->headers->get('X-API-KEY') === $this->apiKey;
    }

    // ===============================
    // PUBLIC : Actualités publiées
    // ===============================
    #[Route('/actualites', methods: ['GET'])]
    public function index(ActualiteRepository $repository): JsonResponse
    {
        $actualites = $repository->findBy(
            ['statut' => 'publie'],
            ['createdAt' => 'DESC']
        );

        return $this->json(
            ['actualites' => $actualites],
            Response::HTTP_OK,
            [],
            ['groups' => 'actualite:read']
        );
    }

    // ===============================
    // ADMIN : Toutes les actualités
    // ===============================
    #[Route('/admin/actualites', methods: ['GET'])]
    public function admin(
        Request $request,
        ActualiteRepository $repository
    ): JsonResponse {

        if (!$this->checkApiKey($request)) {
            return $this->json([
                'success' => false,
                'message' => 'Accès refusé.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $actualites = $repository->findBy([], [
            'createdAt' => 'DESC'
        ]);

        return $this->json(
            ['actualites' => $actualites],
            Response::HTTP_OK,
            [],
            ['groups' => 'actualite:read']
        );
    }

    // ===============================
    // AJOUTER
    // ===============================
    #[Route('/actualites', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {

        if (!$this->checkApiKey($request)) {
            return $this->json([
                'success' => false,
                'message' => 'Accès refusé.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (
            empty($data['titre']) ||
            empty($data['contenu'])
        ) {
            return $this->json([
                'success' => false,
                'message' => 'Le titre et le contenu sont obligatoires.'
            ], Response::HTTP_BAD_REQUEST);
        }

        $actualite = new Actualite();

        $actualite->setTitre($data['titre']);
        $actualite->setContenu($data['contenu']);
        $actualite->setResume($data['resume'] ?? null);
        $actualite->setCategorie($data['categorie'] ?? null);
        $actualite->setTempsLecture($data['tempsLecture'] ?? null);
        $actualite->setImage($data['image'] ?? null);

        $actualite->setStatut('brouillon');
        $actualite->setCreatedAt(new \DateTimeImmutable());

        $em->persist($actualite);
        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Actualité créée avec succès.',
            'actualite' => $actualite
        ], Response::HTTP_CREATED, [], [
            'groups' => 'actualite:read'
        ]);
    }

    // ===============================
    // MODIFIER
    // ===============================
    #[Route('/actualites/{id}', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        ActualiteRepository $repository,
        EntityManagerInterface $em
    ): JsonResponse {

        if (!$this->checkApiKey($request)) {
            return $this->json([
                'success' => false,
                'message' => 'Accès refusé.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $actualite = $repository->find($id);

        if (!$actualite) {
            return $this->json([
                'success' => false,
                'message' => 'Actualité introuvable.'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['titre'])) {
            $actualite->setTitre($data['titre']);
        }

        if (isset($data['contenu'])) {
            $actualite->setContenu($data['contenu']);
        }

        if (isset($data['resume'])) {
            $actualite->setResume($data['resume']);
        }

        if (isset($data['categorie'])) {
            $actualite->setCategorie($data['categorie']);
        }

        if (isset($data['tempsLecture'])) {
            $actualite->setTempsLecture($data['tempsLecture']);
        }

        if (isset($data['image'])) {
            $actualite->setImage($data['image']);
        }

        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Actualité modifiée avec succès.',
            'actualite' => $actualite
        ], Response::HTTP_OK, [], [
            'groups' => 'actualite:read'
        ]);
    }

    // ===============================
    // PUBLIER
    // ===============================
    #[Route('/actualites/{id}/publier', methods: ['POST'])]
    public function publier(
        int $id,
        Request $request,
        ActualiteRepository $repository,
        EntityManagerInterface $em
    ): JsonResponse {

        if (!$this->checkApiKey($request)) {
            return $this->json([
                'success' => false,
                'message' => 'Accès refusé.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $actualite = $repository->find($id);

        if (!$actualite) {
            return $this->json([
                'success' => false,
                'message' => 'Actualité introuvable.'
            ], Response::HTTP_NOT_FOUND);
        }

        $actualite->setStatut('publie');

        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Actualité publiée avec succès.'
        ]);
    }

    // ===============================
    // SUPPRIMER
    // ===============================
    #[Route('/actualites/{id}', methods: ['DELETE'])]
    public function delete(
        int $id,
        Request $request,
        ActualiteRepository $repository,
        EntityManagerInterface $em
    ): JsonResponse {

        if (!$this->checkApiKey($request)) {
            return $this->json([
                'success' => false,
                'message' => 'Accès refusé.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $actualite = $repository->find($id);

        if (!$actualite) {
            return $this->json([
                'success' => false,
                'message' => 'Actualité introuvable.'
            ], Response::HTTP_NOT_FOUND);
        }

        $em->remove($actualite);
        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Actualité supprimée avec succès.'
        ]);
    }
}