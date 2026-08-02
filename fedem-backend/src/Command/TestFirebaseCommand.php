<?php

namespace App\Command;

use App\Service\FirestoreRestService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:test-firebase')]
class TestFirebaseCommand extends Command
{
    public function __construct(private FirestoreRestService $firestore)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $result = $this->firestore->createDocument('test', [
            'message' => 'Connexion REST réussie',
            'date' => date('Y-m-d H:i:s'),
        ]);
        $output->writeln('Document créé : ' . ($result['name'] ?? 'inconnu'));
        return Command::SUCCESS;
    }
}