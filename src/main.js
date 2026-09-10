import './style.css'

document.querySelector('#app').innerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <div class="brand" aria-label="SiteCheck Legal">
        <span class="brand-mark">S</span>
        <span>SiteCheck Legal</span>
      </div>

      <nav class="main-nav" aria-label="Главное меню">
        <a href="#problem">Проблема</a>
        <a href="#offer">Подход</a>
        <a href="#check">Проверка</a>
        <a href="#risks">Риски</a>
        <a href="#faq">FAQ</a>
      </nav>

      <a class="btn btn-primary btn-small" href="#lead-form">Проверить сайт</a>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Юридическая проверка сайтов для бизнеса</span>
          <h1>Сайт выглядит безопасно.<br />А юридически — нет.</h1>
          <p class="lead">Проверяем, как сайт работает на деле: формы, cookies, документы, согласия и публичную информацию.</p>
          <p class="sublead">Найдём нарушения до того, как они станут претензией, проверкой или штрафом.</p>

          <div class="hero-actions">
            <a class="btn btn-primary" href="#lead-form">Проверить мой сайт</a>
            <a class="btn btn-secondary" href="#offer">Как это работает</a>
          </div>

          <div class="hero-metrics" aria-label="Показатели сервиса">
            <div class="metric-item">
              <strong>152-ФЗ</strong>
              <span>Персональные данные</span>
            </div>
            <div class="metric-item">
              <strong>168-ФЗ</strong>
              <span>Публичная информация</span>
            </div>
            <div class="metric-item">
              <strong>3 слоя</strong>
              <span>Аудит, ТЗ, проверка</span>
            </div>
          </div>
        </div>

        <aside class="lead-panel" id="lead-form">
          <div class="panel-topline">Быстрая проверка</div>
          <div class="panel-status">
            <span class="status-dot"></span>
            Анализ сайта в 24–48 часов
          </div>

          <form class="lead-form">
            <label>
              <span>Адрес вашего сайта</span>
              <input type="text" placeholder="https://example.com" />
            </label>

            <label>
              <span>Телефон / Telegram / почта</span>
              <input type="text" placeholder="+7 ..." />
            </label>

            <label>
              <span>ФИО</span>
              <input type="text" placeholder="Иванов Иван Иванович" />
            </label>

            <button class="btn btn-primary" type="submit">Проверить сайт</button>

            <label class="checkbox-row">
              <input type="checkbox" />
              <span>Согласен на обработку персональных данных</span>
            </label>
          </form>

          <div class="panel-links">
            <a href="#check">152-ФЗ</a>
            <a href="#check">168-ФЗ</a>
            <a href="#check">Комплекс</a>
          </div>
        </aside>
      </div>
    </section>

    <section class="section" id="problem">
      <div class="container narrow">
        <p class="eyebrow">Проблема</p>
        <h2>Документы есть. Но сайт может работать вразрез с ними.</h2>

        <div class="alert-box">
          <p>
            На большинстве сайтов политики, согласия и внутренние документы присутствуют формально. При этом сами формы,
            cookies, сервисы и данные собираются без корректного юридического оформления.
          </p>
        </div>

        <div class="risk-grid">
          <div class="risk-box">
            <span>01</span>
            <p>Политика скачана из интернета, но не привязана к реальным данным сайта.</p>
          </div>
          <div class="risk-box">
            <span>02</span>
            <p>Формы собирают данные без корректного согласия и корректного описания цели.</p>
          </div>
          <div class="risk-box">
            <span>03</span>
            <p>Cookies, Яндекс Метрика или аналитика работают без учёта юридических требований.</p>
          </div>
          <div class="risk-box">
            <span>04</span>
            <p>В документах и на сайте разная трактовка данных, целей и ответственности.</p>
          </div>
        </div>

        <div class="result-banner">
          <span>Результат:</span>
          <strong>Внешне всё выглядит как “нормально”. Юридически — часто уже есть скрытые риски.</strong>
        </div>
      </div>
    </section>

    <section class="section accent-section" id="offer">
      <div class="container narrow">
        <p class="eyebrow">Подход</p>
        <h2>Проверяем не документ “в вакууме”, а реальную работу сайта.</h2>

        <div class="flow-row" aria-label="Цепочка проверки сайта">
          <span>Пользователь</span>
          <span class="arrow">→</span>
          <span>форма</span>
          <span class="arrow">→</span>
          <span>данные</span>
          <span class="arrow">→</span>
          <span>согласие</span>
          <span class="arrow">→</span>
          <span>документы</span>
          <span class="arrow">→</span>
          <span>сервисы</span>
          <span class="arrow">→</span>
          <span>риски</span>
        </div>

        <div class="stack-card">
          <h3>Что вы получаете в итоге</h3>
          <ul>
            <li>точное место нарушений;</li>
            <li>оценку критичности;</li>
            <li>что исправлять в первую очередь;</li>
            <li>какие документы и тексты необходимы;</li>
            <li>какие правки нужны непосредственно на сайте.</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section" id="check">
      <div class="container">
        <p class="eyebrow">Два направления проверки</p>
        <h2>Аудит по ключевым правовым блокам</h2>

        <div class="audit-grid">
          <article class="audit-card">
            <span class="badge badge-blue">152-ФЗ</span>
            <h3>Персональные данные</h3>
            <p>Проверяем, как с сайта собираются, обрабатываются и документируются данные пользователей.</p>
            <ul>
              <li>формы обратной связи и регистрации;</li>
              <li>согласия и политика обработки;</li>
              <li>cookies, метрики, аналитика и трекеры;</li>
              <li>соответствие данных в форме и в документах.</li>
            </ul>
            <a class="btn btn-secondary" href="#lead-form">Проверить по 152-ФЗ</a>
          </article>

          <article class="audit-card">
            <span class="badge badge-green">168-ФЗ</span>
            <h3>Публичная информация</h3>
            <p>Проверяем применимые требования к информации, которую бизнес размещает для потребителей и клиентов.</p>
            <ul>
              <li>названия, формулировки и обозначения;</li>
              <li>публичные разделы и тексты для аудитории;</li>
              <li>русскоязычные формулировки и их корректность;</li>
              <li>соответствие содержания требованиям закона.</li>
            </ul>
            <a class="btn btn-secondary" href="#lead-form">Проверить по 168-ФЗ</a>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="risks">
      <div class="container narrow">
        <p class="eyebrow">Почему это критично</p>
        <h2>Одна форма или один документ могут создавать реальный риск.</h2>

        <div class="risk-list">
          <div class="risk-item">
            <h3>Документ есть</h3>
            <p>Но форма на сайте работает не так, как описано в документе. Нельзя закрыть риск одной ссылкой.</p>
          </div>
          <div class="risk-item">
            <h3>Согласие есть</h3>
            <p>Но оно составлено в общей форме, без привязки к реальным данным и практическому сбору.</p>
          </div>
          <div class="risk-item">
            <h3>Аналитика подключена</h3>
            <p>Но cookies и сторонние модули не отображены в договорной и правовой логике сайта.</p>
          </div>
          <div class="risk-item">
            <h3>Реклама запущена</h3>
            <p>Но само юридическое оформление сайта не проверено. Это отдельный слой ответственности.</p>
          </div>
        </div>

        <div class="quote-panel">
          <p>Поэтому задача не в “выдаче документов”, а в том, чтобы сайт и документы были в одном правовом состоянии.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="eyebrow">Что проверяем</p>
        <h2>Полный юридический контур сайта</h2>

        <div class="scope-grid">
          <article class="scope-item">
            <span>01</span>
            <h3>Контент</h3>
            <p>Тексты, разделы, обозначения, структура информации и публичные элементы сайта.</p>
          </article>
          <article class="scope-item">
            <span>02</span>
            <h3>Формы</h3>
            <p>Обратная связь, заявки, подписки, регистрация, опросы и связанные действия.</p>
          </article>
          <article class="scope-item">
            <span>03</span>
            <h3>Данные</h3>
            <p>Какие сведения собирает сайт и на каком основании их можно обрабатывать.</p>
          </article>
          <article class="scope-item">
            <span>04</span>
            <h3>Согласия</h3>
            <p>Наличие и корректность механизмов получения согласия на обработку данных.</p>
          </article>
          <article class="scope-item">
            <span>05</span>
            <h3>Документы</h3>
            <p>Политики, заявления, шаблоны и сопутствующие тексты на сайте.</p>
          </article>
          <article class="scope-item">
            <span>06</span>
            <h3>Cookies</h3>
            <p>Использование трекеров, аналитики и сторонних сервисов на сайте.</p>
          </article>
          <article class="scope-item">
            <span>07</span>
            <h3>Публичная информация</h3>
            <p>Соответствие сайта требованиям к информации для потребителей и клиентов.</p>
          </article>
          <article class="scope-item highlight">
            <span>08</span>
            <h3>Целостность</h3>
            <p>Самое главное: документы и сайт должны описывать одну и ту же реальность.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section danger-section">
      <div class="container narrow">
        <p class="eyebrow">Риск</p>
        <h2>Часто ошибка дешевле выявить до претензии, чем после неё.</h2>

        <div class="risk-stack">
          <p>Нарушения в обработке персональных данных могут вести к самостоятельным административным последствиям.</p>
          <p>Сложность в том, что проблема иногда прячется в одном скрытом поле, одном checkbox или одном сервисе.</p>
          <p>Именно поэтому аудит лучше проводить до проверки, а не после конфликта или получения претензии.</p>
        </div>

        <div class="centered-actions">
          <a class="btn btn-primary" href="#lead-form">Узнать, есть ли нарушения</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="eyebrow">Кому подойдёт</p>
        <h2>Проверка для бизнеса, который не хочет рисковать</h2>

        <div class="tag-grid">
          <span class="tag">Интернет-магазин</span>
          <span class="tag">Компании услуг</span>
          <span class="tag">Онлайн-сервисы</span>
          <span class="tag">Клиники</span>
          <span class="tag">Медицинские проекты</span>
          <span class="tag">Образование</span>
          <span class="tag">B2B-компании</span>
          <span class="tag">Любой коммерческий сайт</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="eyebrow">Процесс</p>
        <h2>От ссылки до понятного результата</h2>

        <div class="steps-grid">
          <article class="step-item">
            <span>01</span>
            <h3>Вы отправляете сайт</h3>
            <p>Получаем ссылку и информацию о том, как бизнес работает и что собирает.</p>
          </article>
          <article class="step-item">
            <span>02</span>
            <h3>Анализируем</h3>
            <p>Проверяем форму, данные, документы, cookies и вынесенные требования.</p>
          </article>
          <article class="step-item">
            <span>03</span>
            <h3>Показываем проблемные точки</h3>
            <p>Вы получаете список нарушений и их юридическую значимость.</p>
          </article>
          <article class="step-item">
            <span>04</span>
            <h3>Готовим документы</h3>
            <p>Составляем корректные тексты и дорабатываем в рамках конкретного сайта.</p>
          </article>
          <article class="step-item">
            <span>05</span>
            <h3>Формируем ТЗ</h3>
            <p>Если нужно менять сам сайт, даём понятное техническое задание разработчику.</p>
          </article>
          <article class="step-item">
            <span>06</span>
            <h3>Проверяем повторно</h3>
            <p>После правок возвращаемся к сайту и сверяем результат.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container narrow">
        <p class="eyebrow">Что получаете</p>
        <h2>Итог — не “папка с документами”, а работающий механизм соответствия.</h2>

        <ul class="output-list">
          <li>полный аудит сайта;</li>
          <li>карту выявленных рисков;</li>
          <li>рекомендации по исправлению;</li>
          <li>необходимые документы;</li>
          <li>корректировки форм и текстов;</li>
          <li>пояснения по cookies и сервисам;</li>
          <li>ТЗ для разработчика;</li>
          <li>повторную проверку после правок.</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container narrow">
        <p class="eyebrow">Сравнение</p>
        <h2>Шаблонные документы или аудит под сайт?</h2>

        <div class="comparison-grid">
          <article class="compare-card">
            <h3>Шаблон</h3>
            <ul class="negative-list">
              <li>не учитывает реальные формы сайта;</li>
              <li>не знает, что именно собирается;</li>
              <li>не проверяет используемые сервисы;</li>
              <li>не отражает бизнес-реалии компании;</li>
              <li>не защищает от фактических рисков.</li>
            </ul>
          </article>

          <article class="compare-card">
            <h3>Индивидуальный аудит</h3>
            <ul class="positive-list">
              <li>анализируем именно ваш сайт;</li>
              <li>проверяем реальные сценарии использования;</li>
              <li>сопоставляем документы и фактическую работу;</li>
              <li>адаптируем тексты под ваш бизнес;</li>
              <li>снижаем риск до того, как он проявится.</li>
            </ul>
          </article>
        </div>

        <div class="final-quote">
          <strong>Документ должен описывать ваш сайт так, как он реально устроен, а не абстрактную компанию из шаблона.</strong>
        </div>
      </div>
    </section>

    <section class="section faq-wrap" id="faq">
      <div class="container narrow">
        <p class="eyebrow">FAQ</p>
        <h2>Частые вопросы</h2>

        <div class="faq-list">
          <div class="faq-item active">
            <button class="faq-question" type="button">У нас уже есть политика — зачем аудит?</button>
            <div class="faq-answer">
              <p>Наличие документа не означает, что сайт оформлен корректно. Нужно проверить сам сайт, формы, методы сбора данных и соответствие текста реальной практике.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question" type="button">Можно просто скачать документы из интернета?</button>
            <div class="faq-answer">
              <p>Можно, но такой шаблон не учитывает ваш реальный сбор данных, формы, цели обработки и сервисы, которыми пользуется ваш сайт.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question" type="button">Вы проверяете только 152-ФЗ?</button>
            <div class="faq-answer">
              <p>Нет. Проверка строится по нескольким направлениям: персональные данные, публичная информация, документы и фактическая работа сайта.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question" type="button">А нужно ли дорабатывать сам сайт?</button>
            <div class="faq-answer">
              <p>Не всегда. Но если есть технические нарушения, мы фиксируем их и формируем понятное техническое задание для разработчика.</p>
            </div>
          </div>

          <div class="faq-item">
            <button class="faq-question" type="button">Сколько это занимает по времени?</button>
            <div class="faq-answer">
              <p>Срок зависит от масштаба сайта, количества форм, сервисов и документов. После первичного анализа определяется точный срок.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section final-cta-wrap">
      <div class="container">
        <div class="final-cta">
          <div>
            <p class="eyebrow light">Начать безопасно</p>
            <h2>Не ждите претензии — проверьте сайт уже сегодня.</h2>
          </div>

          <div class="final-cta-actions">
            <a class="btn btn-primary" href="#lead-form">Связаться с нами</a>
          </div>

          <p class="cta-meta">152-ФЗ • 168-ФЗ • Комплексная проверка • Юридический аудит сайта</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div>© 2026 SiteCheck Legal</div>
      <div>Проверка сайта • Юридический аудит • ТЗ для разработчика</div>
    </div>
  </footer>
`

const faqButtons = document.querySelectorAll('.faq-question')
faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.parentElement
    const isOpen = item.classList.contains('active')

    document.querySelectorAll('.faq-item').forEach((faqItem) => faqItem.classList.remove('active'))

    if (!isOpen) {
      item.classList.add('active')
    }
  })
})

document.querySelector('.lead-form')?.addEventListener('submit', (event) => {
  event.preventDefault()
  const submitButton = event.currentTarget.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent

  submitButton.textContent = 'Отправлено'
  submitButton.disabled = true

  setTimeout(() => {
    submitButton.textContent = originalText
    submitButton.disabled = false
    event.currentTarget.reset()
  }, 1500)
})
