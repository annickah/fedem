<?php

namespace App\Service\Helpers;

use Psr\Log\LoggerInterface;

class LogHelper
{
    public function __construct(
        private LoggerInterface $logger
    ) {
    }

    /**
     * Log lié aux actions sur le blog / actualités
     */
    public function blog(string $message): void
    {
        $this->logger->info('[BLOG] ' . $message);
    }

    /**
     * Log générique d'info
     */
    public function info(string $message): void
    {
        $this->logger->info($message);
    }

    /**
     * Log d'erreur
     */
    public function error(string $message): void
    {
        $this->logger->error($message);
    }
}