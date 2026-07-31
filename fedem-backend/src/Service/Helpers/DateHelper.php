<?php

namespace App\Service\Helpers;

class DateHelper
{
    /**
     * Formate une date au format Y-m-d (ex: 2026-07-30)
     */
    public function formatDateYMD(\DateTimeInterface $date): string
    {
        return $date->format('Y-m-d');
    }

    /**
     * Formate une date en français lisible (ex: 30 juillet 2026)
     */
    public function formatDateFr(\DateTimeInterface $date): string
    {
        $mois = [
            1 => 'janvier', 2 => 'février', 3 => 'mars', 4 => 'avril',
            5 => 'mai', 6 => 'juin', 7 => 'juillet', 8 => 'août',
            9 => 'septembre', 10 => 'octobre', 11 => 'novembre', 12 => 'décembre'
        ];

        return $date->format('j') . ' ' . $mois[(int) $date->format('n')] . ' ' . $date->format('Y');
    }
}