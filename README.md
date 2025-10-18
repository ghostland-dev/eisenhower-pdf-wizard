# Matrice d'Eisenhower - Gestion des Priorités

Application web pour organiser vos tâches selon la méthode d'Eisenhower : priorisez selon l'importance et l'urgence pour une meilleure productivité.

## 🎯 Fonctionnalités

- ✅ **Interface intuitive** avec 4 quadrants colorés
- ✅ **Ajout rapide** de tâches avec classification automatique
- ✅ **Sauvegarde automatique** dans le navigateur (LocalStorage)
- ✅ **Export PDF** professionnel avec date de génération
- ✅ **Validation des entrées** pour éviter les erreurs
- ✅ **Responsive design** - fonctionne sur tous les appareils
- ✅ **Mode sombre/clair** automatique selon vos préférences système
- ✅ **Gestion d'erreurs** robuste avec Error Boundary

## 📊 Les 4 Quadrants

1. **À faire** (Urgent & Important) - Priorité absolue
2. **À planifier** (Important, pas urgent) - Investir du temps ici
3. **À déléguer** (Urgent, pas important) - Confier à d'autres
4. **À abandonner** (Ni urgent, ni important) - Éliminer ces distractions

## 🚀 Technologies

- **React 18** + **TypeScript** - Framework moderne et type-safe
- **Vite** - Build ultra-rapide
- **Tailwind CSS** - Design system cohérent
- **shadcn/ui** - Composants UI accessibles
- **jsPDF** + **html2canvas** - Export PDF de qualité
- **Zod** - Validation des données
- **LocalStorage** - Persistance des données

## 💾 Sauvegarde des Données

Vos tâches sont automatiquement sauvegardées dans votre navigateur :
- Sauvegarde automatique après chaque modification
- Les données persistent même après fermeture du navigateur
- Bouton de sauvegarde manuelle disponible
- Aucune donnée envoyée à un serveur externe

## 📱 Installation

```bash
# Cloner le projet
git clone <YOUR_GIT_URL>

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour la production
npm run build
```

## 🔒 Sécurité

- Validation stricte des entrées utilisateur (max 500 caractères)
- Pas de stockage de données sensibles
- Pas d'appels externes non sécurisés
- Protection contre les injections XSS

## 📖 Guide d'Utilisation

1. **Ajouter une tâche** : Tapez votre tâche, sélectionnez la catégorie appropriée, et cliquez sur "Ajouter"
2. **Supprimer une tâche** : Survolez la tâche et cliquez sur l'icône de suppression
3. **Exporter en PDF** : Cliquez sur "Télécharger en PDF" pour générer un document
4. **Tout effacer** : Utilisez le bouton rouge pour recommencer à zéro

## 🌐 Déploiement

L'application peut être déployée sur :
- **Lovable** - Déploiement en un clic via le bouton "Publish"
- **Vercel / Netlify** - Compatible avec tous les hébergeurs de sites statiques
- **GitHub Pages** - Hébergement gratuit

### Configuration du domaine personnalisé

1. Allez dans Project > Settings > Domains
2. Cliquez sur "Connect Domain"
3. Suivez les instructions de configuration DNS

## 📄 Licence

Ce projet est développé avec [Lovable](https://lovable.dev)

## 🤝 Support

Pour toute question ou problème :
- Consultez la [documentation Lovable](https://docs.lovable.dev/)
- Rejoignez la [communauté Discord](https://discord.gg/lovable)

## 🎨 Personnalisation

Le design system est entièrement personnalisable via :
- `src/index.css` - Variables CSS et tokens de couleur
- `tailwind.config.ts` - Configuration Tailwind
- Tous les composants shadcn peuvent être modifiés

---

**Développé avec ❤️ en utilisant Lovable**
