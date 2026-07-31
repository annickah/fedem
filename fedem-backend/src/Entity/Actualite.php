<?php

namespace App\Entity;

use App\Repository\ActualiteRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ActualiteRepository::class)]
#[ORM\Table(name: 'actualite')]
class Actualite
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['actualite:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['actualite:read'])]
    private string $titre = '';

    #[ORM\Column(type: 'text')]
    #[Groups(['actualite:read'])]
    private string $contenu = '';

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['actualite:read'])]
    private ?string $resume = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['actualite:read'])]
    private ?string $categorie = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['actualite:read'])]
    private ?string $tempsLecture = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['actualite:read'])]
    private ?string $image = null;

    #[ORM\Column(length: 20)]
    #[Groups(['actualite:read'])]
    private string $statut = 'brouillon';

    #[ORM\Column]
    #[Groups(['actualite:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): self
    {
        $this->titre = $titre;
        return $this;
    }

    public function getContenu(): string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): self
    {
        $this->contenu = $contenu;
        return $this;
    }

    public function getResume(): ?string
    {
        return $this->resume;
    }

    public function setResume(?string $resume): self
    {
        $this->resume = $resume;
        return $this;
    }

    public function getCategorie(): ?string
    {
        return $this->categorie;
    }

    public function setCategorie(?string $categorie): self
    {
        $this->categorie = $categorie;
        return $this;
    }

    public function getTempsLecture(): ?string
    {
        return $this->tempsLecture;
    }

    public function setTempsLecture(?string $tempsLecture): self
    {
        $this->tempsLecture = $tempsLecture;
        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;
        return $this;
    }

    public function getStatut(): string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): self
    {
        $this->statut = $statut;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }
}