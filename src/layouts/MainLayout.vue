<template>
  <n-layout>
    <n-layout-header bordered>
      <div class="header-content">
        <!-- Бургер-меню -->
        <n-icon size="24" @click="toggleSider" class="burger-icon">
          <MenuOutline />
        </n-icon>

        <h1>ФОРА ТОВ</h1>
        <!-- <h1>Мій Dashboard</h1> -->

        <!-- Додаткова іконка (якщо потрібна) -->
        <!-- <ion-icon name="apps-outline"></ion-icon> -->

        <n-input
          v-model:value="searchValue"
          type="text"
          placeholder="Пошук..."
          loading
          class="search-bar"
        />

        <div class="nav-bar">
          <div class="align">
            <n-icon size="24" @click="doSomething" class="burger-icon">
              <MailOutline />
            </n-icon>
            <p></p>
          </div>

          <div class="align">
            <n-icon size="24" @click="doSomething" class="burger-icon">
              <NotificationsOutline />
            </n-icon>
            <p></p>
          </div>

          <div class="align">
            <n-icon size="24" @click="doSomething" class="burger-icon">
              <PersonCircleOutline />
            </n-icon>
            <p>{{ userName }}</p>
          </div>

          <n-button type="success"> Вийти </n-button>
        </div>
      </div>
    </n-layout-header>

    <n-layout has-sider style="height: 100vh">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          @update:value="handleMenuSelect"
        />
      </n-layout-sider>

      <n-layout>
        <router-view />
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, h, ref } from "vue";
import type { MenuOption } from "naive-ui";
import type { Component } from "vue";
import { NLayout, NLayoutHeader, NLayoutSider, NMenu, NIcon } from "naive-ui";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
  MenuOutline,
  MailOutline,
  NotificationsOutline,
  PersonCircleOutline,
} from "@vicons/ionicons5";

// import { AcUnitOutlined } from "@vicons/material";
import {
  Home12Regular,
  CalendarLtr16Regular,
  VehicleTruckCube20Regular,
  ClipboardTaskListLtr20Regular,
  ReOrder16Regular,
  Money20Regular,
  DocumentPercent20Regular,
  Building20Regular,
  BookExclamationMark24Regular,
  Handshake20Regular,
  BoxDismiss20Regular,
  TableFreezeColumnAndRow28Regular,
  ChartMultiple20Regular,
  BookNumber16Regular,
} from "@vicons/fluent";

import { useRouter } from "vue-router";

// Хелпер для рендеру іконок
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// Опції меню
const menuOptions: MenuOption[] = [
  // {
  //   label: "test",
  //   key: "test",
  //   icon: renderIcon(BookIcon),
  // },
  // {
  //   label: "about",
  //   key: "about",
  //   icon: renderIcon(BookIcon),
  // },

  {
    label: "Дашборд",
    key: "dashboard",
    icon: renderIcon(Home12Regular),
  },

  {
    label: "Постачальники",
    key: "suppliers",
    icon: renderIcon(VehicleTruckCube20Regular),
    // disabled: true,
    children: [
      { label: "Графіки", key: "graphs", icon: renderIcon(CalendarLtr16Regular) },
      { label: "SL", key: "sl", icon: renderIcon(ClipboardTaskListLtr20Regular) },
    ],
  },
  {
    label: "Панельні листи",
    key: "panel-lists",
    icon: renderIcon(ReOrder16Regular),
  },
  {
    label: "Виторги",
    key: "sales",
    icon: renderIcon(Money20Regular),
  },
  {
    label: "Post Percent",
    key: "post-percent",
    icon: renderIcon(DocumentPercent20Regular),
  },

  {
    label: "OFC",
    key: "ofc",
    icon: renderIcon(Building20Regular),
    // disabled: true,
    children: [
      { label: "Штрафи", key: "fines", icon: renderIcon(BookExclamationMark24Regular) },
      { label: "Договори", key: "agreements", icon: renderIcon(Handshake20Regular) },
      { label: "Вимоги", key: "requirements", icon: renderIcon(BookNumber16Regular) },
    ],
  },

  {
    label: "Брудний асортимент",
    key: "dirty-assortment",
    icon: renderIcon(BoxDismiss20Regular),
  },

  {
    label: "Пілот",
    key: "pilot",
    icon: renderIcon(TableFreezeColumnAndRow28Regular),
  },

  {
    label: "Звітність",
    key: "report",
    icon: renderIcon(ChartMultiple20Regular),
  },

  // {
  //   label: "Hear the Wind Sing",
  //   key: "hear-the-wind-sing",
  //   icon: renderIcon(BookIcon),
  // },
  // {
  //   label: "Pinball 1973",
  //   key: "pinball-1973",
  //   icon: renderIcon(BookIcon),
  //   disabled: true,
  //   children: [{ label: "Rat", key: "rat" }],
  // },
  // {
  //   label: "A Wild Sheep Chase",
  //   key: "a-wild-sheep-chase",
  //   disabled: true,
  //   icon: renderIcon(BookIcon),
  // },
  // {
  //   label: "Dance Dance Dance",
  //   key: "Dance Dance Dance",
  //   icon: renderIcon(BookIcon),
  //   children: [
  //     {
  //       type: "group",
  //       label: "People",
  //       key: "people",
  //       children: [
  //         {
  //           label: "Narrator",
  //           key: "narrator",
  //           icon: renderIcon(AcUnitOutlined),
  //         },
  //         {
  //           label: "Sheep Man",
  //           key: "sheep-man",
  //           icon: renderIcon(AcUnitOutlined),
  //         },
  //       ],
  //     },
  //     {
  //       label: "Beverage",
  //       key: "beverage",
  //       icon: renderIcon(WineIcon),
  //       children: [{ label: "Whisky", key: "whisky" }],
  //     },
  //     {
  //       label: "Food",
  //       key: "food",
  //       children: [{ label: "Sandwich", key: "sandwich" }],
  //     },
  //     {
  //       label: "The past increases. The future recedes.",
  //       key: "the-past-increases-the-future-recedes",
  //     },
  //   ],
  // },
];

export default defineComponent({
  components: {
    NLayout,
    NLayoutHeader,
    NLayoutSider,
    NMenu,
    NIcon,
    MenuOutline,
    MailOutline,
    NotificationsOutline,
    PersonCircleOutline,
  },
  setup() {
    const collapsed = ref(false);
    const activeKey = ref<string | null>(null);
    const router = useRouter();
    const searchValue = ref<string | null>(null);
    const userName = ref("Андрієнко Андрій Андрійович");

    const toggleSider = () => {
      collapsed.value = !collapsed.value;
    };

    const doSomething = () => {
      console.log("Something is douin");
    };

    const handleMenuSelect = (key: string) => {
      // приклад: просто переходимо на роут з таким ім'ям або шляхом
      router.push({ name: key }).catch(() => {});
    };

    return {
      collapsed,
      activeKey,
      menuOptions,
      toggleSider,
      handleMenuSelect,
      searchValue,
      doSomething,
      userName,
    };
  },
});
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  /* justify-content: space-evenly; */
  gap: 20px;
  height: 64px;
  padding: 0 20px;
  background-color: #2cb830;
  color: white;
  font-weight: bold;
}

.burger-icon {
  cursor: pointer;
}

.search-bar {
  max-width: 400px;
}

.nav-bar {
  display: flex;
  align-self: center;
  justify-content: center;
  gap: 15px;
  margin-left: auto;
}

.align {
  display: flex;
  align-self: center;
  justify-content: center;
}
</style>
