<script setup>
// Section order follows the brief's block numbering.
import SiteNav from './components/SiteNav.vue'
import HeroIntake from './components/HeroIntake.vue'          // 1  Первый экран
import MismatchSection from './components/MismatchSection.vue' // 2  Проблема
import ChainSection from './components/ChainSection.vue'       // 3  Главный оффер
import LawsSection from './components/LawsSection.vue'         // 4  Два направления
import ComplexSection from './components/ComplexSection.vue'   // 5  Почему комплексная
import ScopeBand from './components/ScopeBand.vue'             // 6  Что проверяем
import RisksSection from './components/RisksSection.vue'       // 7  Риски
import AudienceSection from './components/AudienceSection.vue' // 8  Кому нужна
import StagesSection from './components/StagesSection.vue'     // 9  Как проходит работа
import DeliverySection from './components/DeliverySection.vue' // 10 Что получит клиент
import ComparisonSection from './components/ComparisonSection.vue' // 11 Сравнение
import FaqSection from './components/FaqSection.vue'           // 15 FAQ
import FinalCta from './components/FinalCta.vue'               // 16 Финальный экран
import SiteFooter from './components/SiteFooter.vue'
import LegalModal from './components/LegalModal.vue'
</script>

<template>
  <a class="skip-link" href="#main">Перейти к содержанию</a>
  <SiteNav />

  <main id="main">
    <HeroIntake />
    <MismatchSection />
    <ChainSection />
    <LawsSection />
    <ComplexSection />
    <ScopeBand />
    <RisksSection />
    <AudienceSection />
    <StagesSection />
    <DeliverySection />
    <ComparisonSection />
    <FaqSection />
    <FinalCta />
  </main>

  <SiteFooter />

  <!-- Один экземпляр на всё приложение: и подвал, и форма открывают его же. -->
  <LegalModal />
</template>
