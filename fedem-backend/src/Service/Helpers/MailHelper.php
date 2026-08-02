<?php

namespace App\Service\Helpers;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MailHelper
{
    public function __construct(
        private MailerInterface $mailer
    ) {
    }

   public function sendEmail(
    string $nom,
    string $email,
    string $sujet,
    string $message
): void
{
    dump([
        'nom' => $nom,
        'email' => $email,
        'sujet' => $sujet,
        'message' => $message
    ]);


    $mail = (new Email())
        ->from('mjannickah@gmail.com')
        ->replyTo($email)
        ->to('mjannickah@gmail.com')
        ->subject('Nouveau contact reçu')
        ->text(
            "Nom : ".$nom.
            "\nEmail : ".$email.
            "\nSujet : ".$sujet.
            "\nMessage : ".$message
        );

    try {
    $this->mailer->send($mail);

    file_put_contents(
        __DIR__.'/test_mail_send.txt',
        "OK ENVOI\n",
        FILE_APPEND
    );

} catch (\Exception $e) {

    file_put_contents(
        __DIR__.'/test_mail_error.txt',
        $e->getMessage()."\n",
        FILE_APPEND
    );

    throw $e;
}
    }
}