<script setup lang="ts">
import facebookIcon from '@/assets/icons/footer/facebook.svg'
import instagramIcon from '@/assets/icons/footer/instagram.svg'
import tiktokIcon from '@/assets/icons/footer/tiktok.svg'
import youtubeIcon from '@/assets/icons/footer/youtube.svg'
import paymentIcon from '@/assets/icons/footer/payment.png'
import vet from '@/assets/images/vireak-buntham.png'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 bg-orange-50" id="contact">
    <div class="mx-auto container py-12">
      <div class="flex justify-between gap-8 mb-8">
        <!-- Left Section: Company Info -->
        <div>
          <div class="flex items-center gap-2 mb-6">
            <div class="w-8 h-8 flex items-center justify-center text-white font-bold">
              <img :src="vet" alt="Vireak Buntham Express"/>
            </div>
            <h3 class="text-lg font-bold text-gray-900">{{ t('companyName') }}</h3>
          </div>
          
          <div class="space-y-3 text-sm text-gray-700">
            <div>
              <span class="font-semibold">{{ t('email') }}:</span>
              <a href="mailto:support@vireakbuntham.com" class="text-blue-600 hover:underline ml-2">
                support@vireakbuntham.com
              </a>
            </div>
            <div>
              <span class="font-semibold">{{ t('tel') }}:</span>
              <a href="tel:+85501891911" class="text-blue-600 hover:underline ml-2">
                +855 (0)81 911 911
              </a>
            </div>
          </div>
        </div>

        <!-- Right Section: Follow Us & We Accept -->
        <div class="grid grid-cols-1 gap-8">
          <!-- Follow Us -->
          <div>
            <h4 class="text-base font-bold text-gray-900 mb-4">{{ t('followUs') }}</h4>
            <div class="flex gap-3">
              <a href="#" class="w-8 h-8 flex items-center justify-center transition">
                <img :src="facebookIcon" alt="Facebook">
              </a>
              <a href="#" class="w-8 h-8  flex items-center justify-center transition">
                <img :src="instagramIcon" alt="Instagram">
              </a>
              <a href="#" class="w-8 h-8  flex items-center justify-center transition">
                <img :src="tiktokIcon" alt="TikTok">
              </a>
              <a href="#" class="w-8 h-8  flex items-center justify-center transition">
                <img :src="youtubeIcon" alt="YouTube">
              </a>
            </div>
          </div>

          <!-- We Accept -->
          <div>
            <h4 class="text-base font-bold text-gray-900 mb-4">{{ t('weAccept') }}</h4>
            <div class="flex gap-2 flex-wrap">
              <img :src="paymentIcon" alt="KHIRC" class="h-6">
             
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section: Copyright & Links -->
      <div class="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <p>{{ t('copyright', { year }) }}</p>
        <div class="flex gap-4 mt-4 md:mt-0">
          <a href="/terms" class="hover:text-gray-900 transition">{{ t('terms') }}</a>
          <span>|</span>
          <a href="/privacy" class="hover:text-gray-900 transition">{{ t('privacy') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
