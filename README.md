# Автоматизация сборки проектов под верстку

В данном репозитории делюсь шаблоном для новых проектов с настроенной конфигурацией.
Данный шаблон подойдет для проектов нацеленых на верстку, нежели на модульную JavaScript разработку.

## Что включено?

Подробнее ознакомится с составом шаблона можете посомтрев `package.json`

## Установка

Для установки данного шаблона необходимо клонировать репозиторий и затем выполнить стандартную компанду: `npm i`

Но я решил пойти чуть-чуть дальше...

## Bash скрипт для вашей консоли (iTerm/cmder)

Так же, я добавил простую функцию и несколько алиасов в терминал для автоматизации рутинных действий. _(oh-my-zhs или bash, не важно)_

```bash
createNewProject() {
    // this is alias for directory where you are working
    front
    mkdir $1
    cd $1
    git clone git@github.com:oddman-lab/template-for-layout-development.git
    mv $1/name-of-github-repo/*.* $1/
    rm -rf .git
    npm i
    // this is alias for run your IDE
    code /Users/ilya/Documents/:development/Frontend/web-test
    gulp
}
```
