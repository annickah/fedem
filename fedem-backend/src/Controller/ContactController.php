<?php

namespace App\Controller;

use App\Entity\MessageContact;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Service\Helpers\MailHelper;
use Symfony\Component\Routing\Attribute\Route;

class ContactController extends AbstractController
{
    #[Route('/api/contact', name: 'api_contact', methods: ['POST'])]
    public function contact(Request $request, EntityManagerInterface $em, MailHelper $mailHelper): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        dump($data);

if (empty($data['nom']) || empty($data['email']) || empty($data['sujet']) || empty($data['message'])) {
    return $this->json(['error' => 'Champs manquants'], 400);
}

$contact = new MessageContact();

$contact->setNom($data['nom']);
$contact->setEmail($data['email']);
$contact->setSujet($data['sujet']);
$contact->setMessage($data['message']);
$contact->setDateEnvoi(new \DateTimeImmutable());

try {
    $em->persist($contact);
    $em->flush();

    try {
    file_put_contents(
    __DIR__.'/appel_mail.txt',
    "Avant sendEmail\n",
    FILE_APPEND
);

$mailHelper->sendEmail(
    $data['nom'],
    $data['email'],
    $data['sujet'],
    $data['message']
);
} catch (\Exception $e) {
    return $this->json([
        'erreur_mail' => $e->getMessage()
    ], 500);
}

    return $this->json([
        'success' => true
    ]);
} catch (\Exception $e) {
    return $this->json([
        'error' => $e->getMessage()
    ], 500);
}
    }}