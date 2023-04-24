# Marketplace_Yandex_Lyceum
## Инструкция по запуску проекта в dev-режиме

#### Необходимо:
1. Скопировать репозиторий в нужный каталог
2. Создать виртуалное окружение в каталоге с копией репозитория
3. Активировать виртуалное окружение (требуется находиться в корневом каталоге)
4. Установить зависимости проекта
5. Запустить сервер (требуется находиться в корневом каталоге)
#### Команды
|  | _Windows_ | _macOS_/_Linux_ |
|--|--|--|
| 2 | python -m venv имя_окружения | **На Ubuntu отдельно нужно установить модуть venv командой:* <br>sudo apt install python3-venv <br><br> python3 -m venv имя_окружения|
| 3 | имя_окружения\Scripts\activate.bat | source имя_окружения/bin/activate | 
| 4 | pip install -r requirements.txt | pip3 install -r requirements.txt |
| 5 | запустить файл __init__.py | запустить файл __init__.py |
cd - команда командной строки для изменения рабочего каталога <br>
mkdir - команда командной строки для создания каталога
#### Используемое форматирование
Black - это пакет Python для форматирования вашего кода в соответствии с предопределенным руководством по стилю в одной команде.
Isort — это утилита/библиотека Python для сортировки импорта по алфавиту с автоматическим разделением на разделы и по типам.
