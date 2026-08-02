<?php

namespace App\Controller;

use App\Service\FirestoreRestService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class InquiryController extends AbstractController
{
    private const COLLECTION = 'messages_contact';

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
                ?? $value['booleanValue']
                ?? ($value['nullValue'] ?? null);
        }

        return [
            'id' => $id,
            'type' => 'message',
            'name' => $fields['nom'] ?? '',
            'email' => $fields['email'] ?? '',
            'subject' => $fields['sujet'] ?? '',
            'message' => $fields['message'] ?? '',
            'status' => $fields['statut'] ?? 'new',
            'responseText' => $fields['responseText'] ?? '',
            'responseSent' => (bool)($fields['responseSent'] ?? false),
            'createdAt' => $fields['createdAt'] ?? '',
            'updatedAt' => $fields['updatedAt'] ?? '',
        ];
    }

    #[Route('/inquiries', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        if (!$this->checkApiKey($request)) {
            return $this->json(['success' => false, 'message' => 'Accès refusé.'], Response::HTTP_UNAUTHORIZED);
        }

        $docs = $this->firestore->listDocuments(self::COLLECTION);
        $inquiries = array_map(fn($doc) => $this->docToArray($doc), $docs);
        usort($inquiries, fn($a, $b) => strcmp($b['createdAt'], $a['createdAt']));

        return $this->json(['inquiries' => $inquiries], Response::HTTP_OK);
    }

    #[Route('/inquiries/{id}', methods: ['PUT'])]
    public function update(string $id, Request $request, MailerInterface $mailer): JsonResponse
    {
        if (!$this->checkApiKey($request)) {
            return $this->json(['success' => false, 'message' => 'Accès refusé.'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $status = $data['status'] ?? 'new';
        $responseText = $data['responseText'] ?? '';
        $sendReply = $data['sendReply'] ?? false;

        $docs = $this->firestore->listDocuments(self::COLLECTION);
        $target = null;
        foreach ($docs as $doc) {
            if (basename($doc['name']) === $id) {
                $target = $this->docToArray($doc);
                break;
            }
        }

        if (!$target) {
            return $this->json(['success' => false, 'message' => 'Message introuvable.'], Response::HTTP_NOT_FOUND);
        }

        $responseSent = false;

        if ($sendReply && $responseText !== '') {
            try {
                $mail = (new Email())
                    ->from('mjannickah@gmail.com')
                    ->to($target['email'])
                    ->subject('Réponse à votre message : ' . $target['subject'])
                    ->text($responseText);
                $mailer->send($mail);
                $responseSent = true;
            } catch (\Exception $e) {
                return $this->json(['success' => false, 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        $this->firestore->updateDocument(self::COLLECTION, $id, [
            'statut' => $status,
            'responseText' => $responseText,
            'responseSent' => $responseSent,
            'updatedAt' => (new \DateTimeImmutable())->format(DATE_ATOM),
        ]);

        return $this->json(['success' => true, 'responseSent' => $responseSent]);
    }
}