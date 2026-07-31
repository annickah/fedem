<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;

class TestController extends AbstractController
{
    #[Route('/testmail', name: 'test_mail')]
    public function testMail(MailerInterface $mailer): Response
    {
        $email = (new Email())
            ->from('mjannickah@gmail.com')
            ->to('une_autre_adresse@gmail.com')
            ->subject('Test Symfony Mailer')
            ->text('Test');

        $mailer->send($email);

        return new Response('Mail envoyé');
    }
}