<template>
  <o-sidebar v-model:open="sidebarOpen" :fullheight="true" :fullwidth="false" :overlay="true" :right="true" contentClass="sidebar">
    <o-button
      style="width: 2rem; position: absolute; right: 1rem; top: 1rem; padding-right: 0.5rem; background-color: #1f2937"
      icon-left="times"
      label="X"
      @click="sidebarOpen = false"
    />
    <GatherSVG :key="gatherColor" c="#ffffffde" />
    <h3 class="menu-title">Bot Pannel</h3>

    <ul>
      <li v-for="(menu, index) in menuDropDownLinks.links" :key="index">
        <a class="menu-pill" :href="(menu.href as unknown as string)">
          {{ menu.text }}
        </a>
      </li>
    </ul>
  </o-sidebar>
  <div class="bg-color hero">
    <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
      <header class="flex justify-between items-center py-4">
        <!-- logo - start -->
        <a href="/" class="inline-flex items-center text-black-800 text-xl md:text-3xl font-bold gap-2.5" aria-label="logo">
          <GatherSVG :key="gatherColor" :c="gatherColor" />
          <h1 class="inline gradient-text">Bot Pannel</h1>
          <svg class="w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.015619 12.00781">
            <use xlink:href="#live-1"></use>
            <use xlink:href="#live-2"></use>
            <use xlink:href="#live-3"></use>
            <use xlink:href="#live-4"></use>
            <use xlink:href="#live-5"></use>
          </svg>
        </a>
        <!-- logo - end -->

        <!-- nav - start -->
        <nav class="hidden lg:flex gap-12">
          <o-dropdown v-model="menuDropDownLinks" aria-role="list">
            <template #trigger>
              <o-button style="background-color: transparent">
                <span class="dr-menu inline-flex items-center text-lg font-semibold gap-1"
                  >{{ menuDropDownLinks.text }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-yellow-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style="display: inline"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </o-button>
            </template>

            <a v-for="(menu, index) in menuDropDownLinks.links" :key="index" class="menu-link" :href="(menu.href as unknown as string)">
              <o-dropdown-item
                :value="menu"
                aria-role="listitem"
                class="gap-1 p-1 hover:text-gray-700 hover:dark:text-gray-200 dark:text-gray-300"
              >
                <div class="media">
                  <div class="media-content">
                    {{ menu.text }}
                  </div>
                </div>
              </o-dropdown-item>
            </a>
          </o-dropdown>
          <o-dropdown v-model="menuDropDownBuyYUP" aria-role="list">
            <template #trigger>
              <o-button style="background-color: transparent">
                <span class="dr-menu inline-flex items-center text-lg font-semibold gap-1">
                  {{ menuDropDownBuyYUP.text }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-yellow-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style="display: inline"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </o-button>
            </template>

            <a v-for="(menu, index) in menuDropDownBuyYUP.links" :key="index" class="menu-link" :href="(menu.href as unknown as string)">
              <o-dropdown-item
                :value="menu"
                aria-role="listitem"
                class="gap-1 p-1 hover:text-gray-700 hover:dark:text-gray-200 dark:text-gray-300"
              >
                <div class="media">
                  <div class="media-content">
                    <component :is="(buyIcons as { [k: string]: unknown })[menu.icon]" />
                    {{ menu.text }}
                  </div>
                </div>
              </o-dropdown-item>
            </a>
          </o-dropdown>
          <router-link
            class="text-gray-800 dark:text-gray-200 hover:text-yellow-500 active:text-yellow-700 text-lg font-semibold transition duration-100"
            :to="`/emissions`"
          >
            Emissions
          </router-link>
        </nav>
        <!-- nav - end -->

        <!-- buttons - start -->
        <div class="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-2.5 -ml-8">
          <button
            id="theme-switch"
            class="ml-5 w-16 h-6 rounded-full bg-gray-200 flex items-center transition duration-300 focus:outline-none shadow dark:bg-gray-700"
          >
            <div
              id="svg-theme-switch"
              :class="`
                border border-gray-400 dark:border-white
                w-8
                h-8
                relative
                rounded-full
                transition
                duration-500
                transform
                switch-icon
                ${
                  themeDark
                    ? `
                translate-x-full`
                    : `
                -translate-x-2`
                } 
                text-white`"
              @click="themeSwitch"
              v-html="themeSwitchIcon"
            ></div>
          </button>
        </div>

        <button
          type="button"
          class="inline-flex items-center lg:hidden bg-gray-200 hover:bg-gray-300 focus-visible:ring ring-indigo-300 text-gray-500 active:text-gray-700 text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2"
          style="background: #ffffffde"
          @click="toggleSidebar()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>

          Menu
        </button>
        <!-- buttons - end -->
      </header>
      <!-- menu - end -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getThemeMode } from '../../utils'
import { useMainStore } from '../../store/main'
import UniSwapIcon from '@/components/content/icons/uniSwap.vue'
import QuickSwapIcon from '@/components/content/icons/quickSwap.vue'
import GatherSVG from '@/components/content/logos/gather.vue'

export default defineComponent({
  name: 'HeaderTemplate',
  components: {
    UniSwapIcon,
    QuickSwapIcon,
    GatherSVG
  },
  setup(props) {
    const route = useRoute()
    const isHome = computed(() => route.path.match(/(\/$|\/page\/\d+)/g))
    const store = useMainStore()
    store.theme = getThemeMode()
    const isDarkTheme = () => store.theme === 'dark'
    const gatherColor =  ref(isDarkTheme() ? '#ffffffde' : '#000000de')
  

    const themeDark = ref(isDarkTheme())
    const darkIcon = `🌗`

    const lightIcon = `☀️`
    const themeSwitchIcon = ref(isDarkTheme() ? darkIcon : lightIcon)

    const buyIcons = {
      uniswap: UniSwapIcon,
      quickswap: QuickSwapIcon
    }

    // const routes: Record<string, unknown>[] = inject('routes')
    let sidebarOpen = ref(false)
    const isSwitchingTheme = ref(false)

    const linksFs = [
      {
        text: 'Vote Explorer',
        href: '/'
      },
      {
        text: 'POAP App',
        href: 'https://yup-poap.pages.dev'
      },
      {
        text: 'Meeting Recordings',
        href: 'https://yup-poap.pages.dev/meeting-recordings'
      }
    ]

    const menuDropDownLinks = ref({
      links: linksFs,
      text: 'YUP'
    })

    const linksBuyYup = [
      {
        text: 'Buy on QuickSwap',
        href: 'https://quickswap.exchange/#/swap?inputCurrency=ETH&outputCurrency=0x086373fad3447f7f86252fb59d56107e9e0faafa',
        icon: 'quickswap'
      },
      {
        text: 'Buy on Uniswap',
        href: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x69bBC3F8787d573F1BBDd0a5f40C7bA0Aee9BCC9&chain=mainnet',
        icon: 'uniswap'
      }
    ]

    const menuDropDownBuyYUP = ref({
      links: linksBuyYup,
      text: 'Buy YUP'
    })

    const themeSwitch = async () => {
      if (!isSwitchingTheme.value) {
        const isDarkmode = document.documentElement.classList.contains('dark')
        isSwitchingTheme.value = true
        if (isDarkmode) {
          themeDark.value = false
          document.documentElement.classList.remove('dark')
          document.documentElement.classList.add('light')
          themeSwitchIcon.value = lightIcon
          localStorage.setItem('theme', 'light')
          store.theme = 'light'
          gatherColor.value = '#000000de'
        } else {
          themeDark.value = true
          document.documentElement.classList.remove('light')
          document.documentElement.classList.add('dark')
          themeSwitchIcon.value = darkIcon
          localStorage.setItem('theme', 'dark')
          store.theme = 'dark'
          gatherColor.value = '#ffffffde'
        }
        isSwitchingTheme.value = false
      }
    }

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    onMounted(() => {
      // do nothing.
    })

    return {
      menuDropDownLinks,
      menuDropDownBuyYUP,
      sidebarOpen,
      toggleSidebar,
      props,
      themeDark,
      themeSwitchIcon,
      themeSwitch,
      isHome,
      buyIcons,
      gatherColor
    }
  }
})
</script>

<style lang="scss">
.switch-icon {
  font-size: 1.3rem;
}

.media {
  align-items: flex-start;
  display: flex;
  text-align: left;
}
.media-content {
  flex-basis: auto;
  flex-grow: 1;
  flex-shrink: 1;
  text-align: left;
  overflow-y: hidden;
  overflow-x: auto;
  color: #363636;
  text-shadow: 1px 0px 1px #222;
}

html[class='dark'] .media-content {
  color: gainsboro;
}

html[class='dark'] .dr-menu {
  color: #cecece;
  text-shadow: #080808 0px 1px 4px;
}

.dr-menu {
  color: #434343;
  text-shadow: #939393 0px 1px 4px;
}

.media-left {
  margin-right: 1rem;
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 0;
}
nav .o-drop__menu {
  background: var(--glass-menu-bg);
}

.o-drop__menu--active {
  box-shadow: 0.03rem 0.1rem 0.2rem;
  margin-top: 0.5rem;
  padding: 0.2rem 1.6rem 0.1rem 0.4rem;
  background: var(--glassBg);
  box-shadow: 0 8px 32px 0 var(--glassShadow);
  color: var(--glassText);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  min-width: 8.5rem;
}
.hero {
  max-height: 4rem;
}

.sidebar {
  background: url(/img/res/header-waves.svg), linear-gradient(180deg, #212529 0%, #36354a 61.98%, #3b3c68 100%);
  background-position: 50% 200px, top;
  background-repeat: no-repeat;
  background-size: cover, auto;
  min-width: 18rem;
  padding-top: 2rem;
  color: white;
  padding-left: 1.5rem;
}

.menu-link {
  & > div > div {
    position: relative;
  }

  & > div > div::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--headerColor1);
    transform-origin: bottom right;
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }

  & > div > div:hover::before {
    transform-origin: bottom left;
    transform: scaleX(1);
  }
}

.menu-pill {
  background-color: rgba(221, 221, 221, 0.068);
  border: none;
  color: #cfaf1e;
  padding: 0.2em 5.2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 0.3rem 0.2rem;
  cursor: pointer;
  border-radius: 10rem;
  &:hover {
    border: 1px solid rgb(207, 175, 30);
  }
}
.menu-title {
  text-align: center;
  margin-right: 4em;
  /* margin: 2rem; */
  margin-top: 2em;
  margin-bottom: -0.3em;
  text-transform: uppercase;
  color: #b9b9b9;
  border: 1;
  border-bottom: 1;
  transform: skewX(156deg);
}

.gradient-text {
  background-color: #ca4246;
  background-image: linear-gradient(
    45deg,
    #ca4246 16.666%,
    #e16541 16.666%,
    #e16541 33.333%,
    #f18f43 33.333%,
    #f18f43 50%,
    #8b9862 50%,
    #8b9862 66.666%,
    #476098 66.666%,
    #476098 83.333%,
    #a7489b 83.333%
  );

  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow-text-simple-animation-rev 0.75s ease forwards;
}

.gradient-text:hover {
  animation: rainbow-text-simple-animation 0.5s ease-in forwards;
}

@keyframes rainbow-text-simple-animation-rev {
  0% {
    background-size: 650%;
  }
  40% {
    background-size: 650%;
  }
  100% {
    background-size: 100%;
  }
}

@keyframes rainbow-text-simple-animation {
  0% {
    background-size: 100%;
  }
  80% {
    background-size: 650%;
  }
  100% {
    background-size: 650%;
  }
}

h1 {
  font-family: 'Archivo Black', sans-serif;
  font-weight: normal;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 0;
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
}
</style>
