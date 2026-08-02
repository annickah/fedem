<?php

namespace App\Controller;

use App\Service\FirestoreRestService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Service\Helpers\MailHelper;
use Symfony\Component\Routing\Attribute\Route;

class ContactController extends AbstractController
{
    private const COLLECTION = 'messages_contact';

    #[Route('/api/contact', name: 'api_contact', methods: ['POST'])]
    public function contact(Request $request, FirestoreRestService $firestore, MailHelper $mailHelper): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['nom']) || empty($data['email']) || empty($data['sujet']) || empty($data['message'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }

        $now = (new \DateTimeImmutable())->format(DATE_ATOM);

        try {
            $firestore->createDocument(self::COLLECTION, [
                'nom' => $data['nom'],
                'email' => $data['email'],
                'sujet' => $data['sujet'],
                'message' => $data['message'],
                'statut' => 'new',
                'responseText' => '',
                'responseSent' => false,
                'createdAt' => $now,
                'updatedAt' => $now,
            ]);

            try {
                $mailHelper->sendEmail($data['nom'], $data['email'], $data['sujet'], $data['message']);
            } catch (\Exception $e) {
                return $this->json(['erreur_mail' => $e->getMessage()], 500);
            }

            return $this->json(['success' => true]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}