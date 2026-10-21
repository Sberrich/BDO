from django.core.validators import MaxLengthValidator
from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField("Créé le", auto_now_add=True)
    updated_at = models.DateTimeField("Modifié le", auto_now=True)

    class Meta:
        abstract = True


class PageIntro(TimeStampedModel):
    """Singleton-style page chapeaux (playlists, insights, intervenants)."""

    class PageKey(models.TextChoices):
        PLAYLISTS = "playlists", "Page Playlists"
        INSIGHTS = "insights", "Page Insights"
        INTERVENANTS = "intervenants", "Page Intervenants"

    key = models.CharField("Page", max_length=32, choices=PageKey.choices, unique=True)
    chapeau = models.TextField("Chapeau", validators=[MaxLengthValidator(280)])

    class Meta:
        verbose_name = "Introduction de page"
        verbose_name_plural = "Introductions de pages"
        ordering = ["key"]

    def __str__(self):
        return self.get_key_display()


class Playlist(TimeStampedModel):
    """Named video group — homepage shows first 3 videos per playlist (PLAYLIST_PREVIEW)."""

    titre = models.CharField("Titre", max_length=120, unique=True)
    slug = models.SlugField("Slug", max_length=140, unique=True, blank=True)
    description = models.TextField("Description", blank=True)
    ordre = models.PositiveIntegerField("Ordre d’affichage", default=1)
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Playlist"
        verbose_name_plural = "Playlists"
        ordering = ["ordre", "titre"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.titre) or "playlist"
            slug = base
            n = 2
            while Playlist.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titre


class Video(TimeStampedModel):
    class Langue(models.TextChoices):
        FR = "FR", "Français"
        EN = "EN", "Anglais"
        AR = "AR", "Arabe"

    titre = models.CharField("Titre", max_length=120)
    slug = models.SlugField("Slug", max_length=140, unique=True, blank=True)
    playlist_ref = models.ForeignKey(
        Playlist,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="videos",
        verbose_name="Playlist (réf.)",
    )
    playlist = models.CharField(
        "Playlist (libellé)",
        max_length=60,
        default="Témoignages",
        db_index=True,
        help_text="Denormalisé pour l’API legacy ; synchronisé depuis playlist_ref.",
    )
    ordre = models.PositiveIntegerField("Ordre dans la playlist", default=1)
    sous_titre = models.CharField("Sous-titre", max_length=200, blank=True)
    etiquette = models.CharField("Étiquette", max_length=120, blank=True)
    fichier = models.CharField("Fichier vidéo", max_length=300, help_text="Ex. /videos/temoignages/zakaria-fahim.mp4")
    poster = models.CharField("Image de couverture", max_length=300, blank=True)
    duree = models.CharField("Durée", max_length=40, blank=True)
    langue = models.CharField("Langue", max_length=2, choices=Langue.choices, default=Langue.FR)
    date = models.DateField("Date de publication", null=True, blank=True)
    resume = models.TextField("Résumé", blank=True, validators=[MaxLengthValidator(300)])
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Vidéo"
        verbose_name_plural = "Vidéos"
        ordering = ["playlist", "ordre", "-date"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.titre) or "video"
            slug = base
            n = 2
            while Video.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        if self.playlist_ref_id:
            self.playlist = self.playlist_ref.titre[:60]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.titre} ({self.playlist})"


class Insight(TimeStampedModel):
    class Category(models.TextChoices):
        BAROMETRE = "Baromètre", "Baromètre"
        LIVRE_BLANC = "Livre blanc", "Livre blanc"
        METHODE = "Méthode", "Méthode"
        PEDAGOGIE = "Pédagogie", "Pédagogie"

    class RelatedDoc(models.TextChoices):
        BROCHURE = "brochure", "Brochure"
        BAROMETRE = "barometre", "Baromètre"
        LIVREBLANC = "livreblanc", "Livre blanc"

    titre = models.CharField("Titre", max_length=120)
    slug = models.SlugField("Slug", max_length=140, unique=True, blank=True)
    category = models.CharField("Catégorie", max_length=40, choices=Category.choices, default=Category.METHODE)
    kicker = models.CharField("Surtitre", max_length=120, blank=True)
    date = models.DateField("Date de publication")
    date_label = models.CharField("Date affichée", max_length=40, blank=True)
    lecture = models.CharField("Temps de lecture", max_length=20, default="5 min")
    resume = models.TextField("Résumé", validators=[MaxLengthValidator(400)])
    corps = models.JSONField("Corps (paragraphes)", default=list, blank=True)
    source = models.TextField("Source", blank=True)
    related_doc = models.CharField(
        "Document lié",
        max_length=20,
        choices=RelatedDoc.choices,
        default=RelatedDoc.BROCHURE,
    )
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Article Insights"
        verbose_name_plural = "Articles Insights"
        ordering = ["-date", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.titre) or "insight"
            slug = base
            n = 2
            while Insight.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titre


class Speaker(TimeStampedModel):
    nom = models.CharField("Nom", max_length=120)
    slug = models.SlugField("Slug", max_length=140, unique=True)
    fonction = models.CharField("Fonction", max_length=200, blank=True)
    institution = models.CharField("Institution", max_length=200, blank=True)
    photo = models.CharField(
        "Photo",
        max_length=300,
        blank=True,
        help_text="Ex. /images/people/zakaria-fahim-grey.png",
    )
    bio = models.TextField("Biographie", blank=True)
    linkedin = models.URLField("Profil LinkedIn", blank=True)
    seminaires = models.JSONField("N° séminaires animés", default=list, blank=True)
    is_published = models.BooleanField("Publié", default=True)
    ordre = models.PositiveIntegerField("Ordre d’affichage", default=100)

    class Meta:
        verbose_name = "Intervenant"
        verbose_name_plural = "Intervenants"
        ordering = ["ordre", "nom"]

    def __str__(self):
        return self.nom


class Seminar(TimeStampedModel):
    """Programme sessions — migrated from lib/payload/seminaires.ts."""

    numero = models.IntegerField("N°", unique=True)
    slug = models.SlugField("Slug", max_length=140, unique=True)
    code = models.CharField("Code", max_length=20, blank=True)
    titre = models.CharField("Titre", max_length=200)
    sous_titre = models.CharField("Sous-titre", max_length=300, blank=True)
    objectif = models.TextField("Objectif", blank=True)
    dates = models.CharField("Dates", max_length=120, blank=True)
    horaire = models.CharField("Horaire", max_length=80, blank=True)
    heures = models.PositiveIntegerField("Heures", default=0)
    lieu = models.CharField("Lieu", max_length=120, blank=True)
    jour1_matin = models.TextField("Jour 1 — matin", blank=True)
    jour1_apres_midi = models.TextField("Jour 1 — après-midi", blank=True)
    jour2_matin = models.TextField("Jour 2 — matin", blank=True)
    jour2_apres_midi = models.TextField("Jour 2 — après-midi", blank=True)
    livrable = models.TextField("Livrable", blank=True)
    actualisation = models.TextField("Actualisation", blank=True)
    speaker_slugs = models.JSONField(
        "Slugs intervenants (cache)",
        default=list,
        blank=True,
        help_text="Denormalisé ; source de vérité = M2M speakers via SeminarSpeaker.",
    )
    speakers = models.ManyToManyField(
        Speaker,
        through="SeminarSpeaker",
        related_name="seminars_linked",
        blank=True,
        verbose_name="Intervenants",
    )
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Séminaire"
        verbose_name_plural = "Séminaires"
        ordering = ["numero"]

    def __str__(self):
        return f"{self.numero}. {self.titre}"

    def sync_speaker_slugs(self):
        """Refresh denormalized slug list from M2M; keep unknown guest slugs from cache."""
        m2m = list(
            self.seminar_speakers.select_related("speaker")
            .order_by("ordre", "id")
            .values_list("speaker__slug", flat=True)
        )
        previous = list(self.speaker_slugs or [])
        merged = m2m + [s for s in previous if s not in m2m]
        if merged != previous:
            self.speaker_slugs = merged
            self.save(update_fields=["speaker_slugs", "updated_at"])

    def set_speakers_by_slugs(self, slugs: list[str]):
        """Replace M2M links from ordered slug list; keep unknown slugs in cache only."""
        cleaned = [str(s).strip() for s in (slugs or []) if str(s).strip()]
        previous_ids = set(self.speakers.values_list("id", flat=True))
        SeminarSpeaker.objects.filter(seminar=self).delete()
        known = {s.slug: s for s in Speaker.objects.filter(slug__in=cleaned)}
        for i, slug in enumerate(cleaned, start=1):
            speaker = known.get(slug)
            if speaker:
                SeminarSpeaker.objects.create(seminar=self, speaker=speaker, ordre=i)
        self.speaker_slugs = cleaned
        self.save(update_fields=["speaker_slugs", "updated_at"])
        new_ids = {known[s].id for s in cleaned if s in known}
        for speaker in Speaker.objects.filter(id__in=previous_ids | new_ids):
            nums = list(
                speaker.seminars_linked.order_by("numero").values_list("numero", flat=True)
            )
            if nums != (speaker.seminaires or []):
                speaker.seminaires = nums
                speaker.save(update_fields=["seminaires", "updated_at"])


class SeminarSpeaker(models.Model):
    seminar = models.ForeignKey(Seminar, on_delete=models.CASCADE, related_name="seminar_speakers")
    speaker = models.ForeignKey(Speaker, on_delete=models.CASCADE, related_name="seminar_links")
    ordre = models.PositiveIntegerField("Ordre", default=1)

    class Meta:
        verbose_name = "Intervenant du séminaire"
        verbose_name_plural = "Intervenants des séminaires"
        ordering = ["ordre", "id"]
        unique_together = [("seminar", "speaker")]

    def __str__(self):
        return f"{self.seminar} → {self.speaker}"


class SiteSettings(TimeStampedModel):
    """Singleton: brand, contact, SEO defaults (from site.ts contact / promesse)."""

    nom = models.CharField("Nom du site", max_length=80, default="CFO 4.0")
    sous_titre_officiel = models.CharField("Sous-titre officiel", max_length=200, blank=True)
    cosignature = models.CharField("Cosignature", max_length=200, blank=True)
    domaine = models.CharField("Domaine", max_length=120, blank=True)
    base_url = models.URLField("URL de base", blank=True)
    promesse_titre = models.TextField("Promesse — titre", blank=True)
    promesse_sous_titre = models.TextField("Promesse — sous-titre", blank=True)
    contact_nom = models.CharField("Contact — nom", max_length=120, blank=True)
    contact_fonction = models.CharField("Contact — fonction", max_length=120, blank=True)
    contact_email = models.EmailField("Contact — e-mail", blank=True)
    contact_telephone = models.CharField("Contact — téléphone", max_length=40, blank=True)
    contact_linkedin = models.URLField("Contact — LinkedIn", blank=True)
    adresse_iscae = models.TextField("Adresse ISCAE", blank=True)
    lieu_formation = models.TextField("Lieu de formation", blank=True)
    seo_title_template = models.CharField(
        "Modèle titre SEO",
        max_length=160,
        blank=True,
        help_text="Ex. {page} · CFO 4.0 | ISCAE × BDO",
    )
    seo_description_default = models.TextField("Description SEO par défaut", blank=True)
    show_flags = models.JSONField(
        "Feature flags (SHOW)",
        default=dict,
        blank=True,
        help_text="Miroir optionnel de lib/content.ts SHOW — ne remplace pas le frontend sans wiring.",
    )

    class Meta:
        verbose_name = "Paramètres du site"
        verbose_name_plural = "Paramètres du site"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return self.nom or "Paramètres du site"


class HomepageSection(TimeStampedModel):
    """Editable homepage blocks; body JSON mirrors site.ts section shapes."""

    key = models.SlugField("Clé", max_length=40, unique=True)
    title = models.CharField("Titre", max_length=200, blank=True)
    chapeau = models.TextField("Chapeau", blank=True)
    body = models.JSONField("Contenu (JSON)", default=dict, blank=True)
    ordre = models.PositiveIntegerField("Ordre", default=100)
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Section d’accueil"
        verbose_name_plural = "Sections d’accueil"
        ordering = ["ordre", "key"]

    def __str__(self):
        return self.key


class Statistic(TimeStampedModel):
    class Group(models.TextChoices):
        HERO_FAITS = "hero_faits", "Faits (hero)"
        CONSTAT = "constat", "Constat"
        OTHER = "other", "Autre"

    group = models.CharField("Groupe", max_length=32, choices=Group.choices, db_index=True)
    valeur = models.CharField("Valeur", max_length=40)
    unite = models.CharField("Unité", max_length=40, blank=True)
    libelle = models.CharField("Libellé", max_length=200)
    icone = models.CharField("Icône", max_length=40, blank=True)
    accent = models.BooleanField("Accent", default=False)
    ordre = models.PositiveIntegerField("Ordre", default=1)
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Statistique"
        verbose_name_plural = "Statistiques"
        ordering = ["group", "ordre"]

    def __str__(self):
        return f"{self.group}: {self.valeur} {self.libelle}"


class Partner(TimeStampedModel):
    nom = models.CharField("Nom", max_length=120)
    role = models.CharField("Rôle", max_length=120, blank=True)
    logo = models.CharField("Logo", max_length=300, blank=True)
    lien = models.URLField("Lien", blank=True)
    ordre = models.PositiveIntegerField("Ordre", default=1)
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Partenaire"
        verbose_name_plural = "Partenaires"
        ordering = ["ordre", "nom"]

    def __str__(self):
        return self.nom


class PressItem(TimeStampedModel):
    nom = models.CharField("Média", max_length=120)
    titre = models.CharField("Titre", max_length=300)
    description = models.TextField("Description", blank=True)
    lien = models.URLField("Lien")
    logo = models.CharField("Logo", max_length=300, blank=True)
    domaine = models.CharField("Domaine", max_length=120, blank=True)
    apercu = models.CharField("Aperçu", max_length=300, blank=True)
    ordre = models.PositiveIntegerField("Ordre", default=1)
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Article presse"
        verbose_name_plural = "Revue de presse"
        ordering = ["ordre", "nom"]

    def __str__(self):
        return f"{self.nom} — {self.titre}"


class Resource(TimeStampedModel):
    """Downloadable docs / brochure teasers (site.docs + RESOURCES_MENU)."""

    key = models.SlugField("Clé", max_length=40, unique=True)
    titre = models.CharField("Titre", max_length=200)
    description = models.CharField("Description", max_length=300, blank=True)
    fichier = models.CharField(
        "Fichier / chemin",
        max_length=300,
        blank=True,
        help_text="Ex. /docs/… ou assets/docs/…",
    )
    cover = models.CharField("Couverture", max_length=300, blank=True)
    href = models.CharField("Lien page", max_length=200, blank=True)
    icon = models.CharField("Icône", max_length=40, blank=True)
    poids = models.CharField("Poids", max_length=40, blank=True)
    ordre = models.PositiveIntegerField("Ordre", default=1)
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Ressource"
        verbose_name_plural = "Ressources"
        ordering = ["ordre", "key"]

    def __str__(self):
        return self.titre


class FaqGroup(TimeStampedModel):
    slug = models.SlugField("Slug", max_length=40, unique=True)
    titre = models.CharField("Titre", max_length=120)
    ordre = models.PositiveIntegerField("Ordre", default=1)
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Groupe FAQ"
        verbose_name_plural = "Groupes FAQ"
        ordering = ["ordre", "slug"]

    def __str__(self):
        return self.titre


class FaqItem(TimeStampedModel):
    group = models.ForeignKey(FaqGroup, on_delete=models.CASCADE, related_name="questions")
    external_id = models.SlugField("ID stable", max_length=80, unique=True)
    question = models.CharField("Question", max_length=400)
    reponse_courte = models.TextField("Réponse courte", blank=True)
    reponse_html = models.TextField("Réponse HTML")
    lien_texte = models.CharField("Lien — texte", max_length=120, blank=True)
    lien_href = models.CharField("Lien — href", max_length=200, blank=True)
    accueil = models.BooleanField("Afficher à l’accueil", default=False)
    hides_if_tarif = models.BooleanField(
        "Masquer si tarif caché",
        default=False,
        help_text="Aligné sur SHOW.tarif / PRICE_FAQ du frontend.",
    )
    ordre = models.PositiveIntegerField("Ordre", default=1)
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "Question FAQ"
        verbose_name_plural = "Questions FAQ"
        ordering = ["group__ordre", "ordre", "external_id"]

    def __str__(self):
        return self.question[:80]
