<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260730221219 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE actualite ADD resume VARCHAR(500) DEFAULT NULL, ADD temps_lecture VARCHAR(50) DEFAULT NULL, CHANGE image image VARCHAR(500) DEFAULT NULL, CHANGE categorie categorie VARCHAR(100) DEFAULT NULL, CHANGE statut statut VARCHAR(20) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE actualite DROP resume, DROP temps_lecture, CHANGE categorie categorie VARCHAR(100) NOT NULL, CHANGE image image VARCHAR(255) DEFAULT NULL, CHANGE statut statut VARCHAR(50) NOT NULL');
    }
}
