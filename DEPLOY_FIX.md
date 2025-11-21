# 🔧 Исправление ошибки деплоя GitHub Actions

## Проблема
GitHub Actions не может задеплоить из ветки `development` из-за правил защиты окружения `github-pages`.

## ✅ Решение

Workflow обновлен для деплоя только из веток `main` или `master`.

### Вариант 1: Слить изменения в main (рекомендуется)

```bash
# Переключитесь на main
git checkout main

# Слейте изменения из development
git merge development

# Запушьте
git push origin main
```

После этого GitHub Actions автоматически задеплоит проект.

### Вариант 2: Продолжить работу с development, деплоить через docs/

Если вы хотите продолжать работать в ветке `development`, используйте ручной деплой:

1. **Соберите и подготовьте файлы:**
   ```bash
   ./scripts/fix-deploy.sh
   ```

2. **Закоммитьте и запушьте:**
   ```bash
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

3. **Настройте GitHub Pages для использования папки docs:**
   - Откройте: https://github.com/lvp0110/ag_training_tests/settings/pages
   - Source: **Deploy from a branch** (не GitHub Actions)
   - Branch: **development**
   - Folder: **/docs**
   - Сохраните

### Вариант 3: Настроить environment для development

Если вы хотите разрешить деплой из `development`:

1. Откройте: https://github.com/lvp0110/ag_training_tests/settings/environments
2. Найдите environment `github-pages`
3. В разделе "Deployment branches" добавьте правило:
   - Branch name pattern: `development`
   - Type: `Selected branches`
4. Сохраните

Затем верните `development` в workflow:
```yaml
on:
  push:
    branches:
      - main
      - master
      - development
```

## 🎯 Рекомендация

Используйте **Вариант 1** - это стандартная практика:
- `development` - для разработки
- `main`/`master` - для production деплоя

