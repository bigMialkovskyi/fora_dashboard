<template>
  <div class="wrapper">
    <!-- Контроли для керування колонками -->
    <div class="column-controls mb-4 flex justify-end">
      <div class="relative">
        <button
          @click="showColumnMenu = !showColumnMenu"
          class="p-button p-button-text p-button-plain flex items-center gap-2"
          type="button"
        >
          <i class="pi pi-cog" style="font-size: 1rem"></i>
          Колонки
          <i
            :class="showColumnMenu ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
            style="font-size: 0.8rem"
          ></i>
        </button>

        <!-- Випадаюче меню для колонок -->
        <div v-if="showColumnMenu" class="column-menu p-component" @click.stop>
          <div class="menu-header">
            <button
              @click="showAllColumns"
              class="p-button p-button-sm p-button-success p-button-text"
              type="button"
            >
              <i class="pi pi-eye" style="margin-right: 0.25rem"></i>
              Показати всі
            </button>
            <button
              @click="hideAllColumns"
              class="p-button p-button-sm p-button-danger p-button-text"
              type="button"
            >
              <i class="pi pi-eye-slash" style="margin-right: 0.25rem"></i>
              Приховати всі
            </button>
          </div>

          <div class="menu-items">
            <div
              v-for="column in allColumns"
              :key="column.field"
              class="menu-item p-field-checkbox"
              @click="toggleColumn(column.field)"
            >
              <div class="p-checkbox-wrapper">
                <div
                  class="p-checkbox-box"
                  :class="{ 'p-checkbox-checked': isColumnVisible(column.field) }"
                >
                  <i v-if="isColumnVisible(column.field)" class="p-checkbox-icon pi pi-check"></i>
                </div>
              </div>
              <span class="column-label">{{ column.header }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DataTable
      :value="contracts"
      :paginator="true"
      :rows="10"
      :reorderableColumns="true"
      @column-reorder="onColumnReorder"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25, 50]"
      currentPageReportTemplate="Показано з {first} по {last} з {totalRecords} записів"
      sortMode="multiple"
      removableSort
    >
      <Column
        v-for="column in dynamicColumns"
        :key="column.field"
        :field="column.field"
        :header="column.header"
        :sortable="true"
      >
        <!-- Особливий template для колонки з днями тижня -->
        <template v-if="column.field === 'days'" #body="{ data }">
          <div class="days-wrapper flex flex-col gap-1">
            <!-- Перший рядок - основні дні (ПН-НД) -->
            <div class="flex gap-1">
              <span
                v-for="(day, index) in mainDays"
                :key="index"
                :class="{ 'day-badge-green': data[day.key], 'day-badge': !data[day.key] }"
                @click="handleDayClick(data, day.key)"
                class="cursor-pointer elem"
              >
                {{ day.label }}
              </span>
            </div>

            <!-- Другий рядок - додаткові дні (В1-В7) -->
            <div class="flex gap-1">
              <span
                v-for="(day, index) in extraDays"
                :key="index"
                :class="{ 'day-badge-orange': data[day.key], 'day-badge': !data[day.key] }"
                @click="handleDayClick(data, day.key)"
                class="cursor-pointer elem"
              >
                {{ day.label }}
              </span>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import suppliers from "@/api/suppliers.json";

interface Contract {
  "№ договора": string;
  FilID: number;
  Филиал: string;
  PostID: number;
  Поставщик: string;
  RemarkPay: string;
  "Дней до поставки": number;
  Частота: number;
  ПН: number;
  ВТ: number;
  СР: number;
  ЧТ: number;
  ПТ: number;
  СБ: number;
  ВС: number;
  В1: number;
  В2: number;
  В3: number;
  В4: number;
  В5: number;
  В6: number;
  В7: number;
}

interface TableColumn {
  field: string;
  header: string;
}

export default defineComponent({
  name: "TableComponent",
  components: {
    DataTable,
    Column,
  },
  data() {
    return {
      mainDays: [
        { key: "ПН", label: "ПН" },
        { key: "ВТ", label: "ВТ" },
        { key: "СР", label: "СР" },
        { key: "ЧТ", label: "ЧТ" },
        { key: "ПТ", label: "ПТ" },
        { key: "СБ", label: "СБ" },
        { key: "ВС", label: "НД" },
      ],
      extraDays: [
        { key: "В1", label: "В1" },
        { key: "В2", label: "В2" },
        { key: "В3", label: "В3" },
        { key: "В4", label: "В4" },
        { key: "В5", label: "В5" },
        { key: "В6", label: "В6" },
        { key: "В7", label: "В7" },
      ],
      contracts: suppliers.data as Contract[],
      showColumnMenu: false, // Контроль відображення меню колонок

      // Всі доступні колонки
      allColumns: [
        { field: "№ договора", header: "№ договора" },
        { field: "FilID", header: "FilID" },
        { field: "Филиал", header: "Филиал" },
        { field: "PostID", header: "PostID" },
        { field: "Поставщик", header: "Поставщик" },
        { field: "RemarkPay", header: "Призначення оплати" },
        { field: "Дней до поставки", header: "Днів до поставки" },
        { field: "Частота", header: "Частота" },
        { field: "days", header: "Дні тижня" },
      ] as TableColumn[],

      // Початковий порядок видимих колонок
      dynamicColumns: [
        { field: "№ договора", header: "№ договора" },
        { field: "FilID", header: "FilID" },
        { field: "Филиал", header: "Филиал" },
        { field: "PostID", header: "PostID" },
        { field: "Поставщик", header: "Поставщик" },
        { field: "RemarkPay", header: "Призначення оплати" },
        { field: "Дней до поставки", header: "Днів до поставки" },
        { field: "Частота", header: "Частота" },
        { field: "days", header: "Дні тижня" },
      ] as TableColumn[],
    };
  },
  methods: {
    handleDayClick(contract: Contract, dayKey: string) {
      console.log(`Клікнуто на ${dayKey} для договору ${contract["№ договора"]}`);
      contract[dayKey] = contract[dayKey] ? 0 : 1;
    },

    onColumnReorder(event: any) {
      console.log("Column reorder event:", event);

      if (!event) {
        console.warn("No event provided");
        return;
      }

      // Обробляємо різні типи подій від PrimeVue
      if (event.columns && Array.isArray(event.columns)) {
        // Стандартний тип події з масивом колонок
        this.handleColumnsReorder(event.columns);
      } else if (typeof event.dragIndex === "number" && typeof event.dropIndex === "number") {
        // Альтернативний тип події з індексами
        this.handleIndexReorder(event.dragIndex, event.dropIndex);
      } else {
        // Ігноруємо невідомі типи подій без warning'у
        console.log("Ignoring event type:", Object.keys(event));
      }
    },

    handleColumnsReorder(columns: any[]) {
      // Отримуємо всі видимі поля
      const visibleFields = this.dynamicColumns.map((col) => col.field);

      // Створюємо новий масив колонок на основі columns
      const newColumns: TableColumn[] = [];

      columns.forEach((col: any) => {
        const field = col.props?.field;
        const header = col.props?.header;

        // Додаємо тільки видимі колонки без дублікатів
        if (field && visibleFields.includes(field) && !newColumns.find((c) => c.field === field)) {
          newColumns.push({ field, header });
        }
      });

      // Перевіряємо, чи всі видимі колонки присутні
      const missingColumns = visibleFields.filter(
        (field) => !newColumns.find((col) => col.field === field)
      );

      // Додаємо відсутні колонки в кінець
      missingColumns.forEach((field) => {
        const originalColumn = this.dynamicColumns.find((col) => col.field === field);
        if (originalColumn) {
          newColumns.push(originalColumn);
        }
      });

      // Оновлюємо тільки якщо є правильна кількість колонок
      if (newColumns.length === this.dynamicColumns.length) {
        this.dynamicColumns = newColumns;
        console.log("Новий порядок колонок:", this.dynamicColumns);
        this.saveColumnOrder();
      }
    },

    handleIndexReorder(dragIndex: number, dropIndex: number) {
      // Обробляємо перестановку колонок за індексами
      if (
        dragIndex >= 0 &&
        dropIndex >= 0 &&
        dragIndex < this.dynamicColumns.length &&
        dropIndex < this.dynamicColumns.length &&
        dragIndex !== dropIndex
      ) {
        const newColumns = [...this.dynamicColumns];
        const draggedColumn = newColumns.splice(dragIndex, 1)[0];
        newColumns.splice(dropIndex, 0, draggedColumn);

        this.dynamicColumns = newColumns;
        console.log("Колонки переставлені за індексами:", dragIndex, "->", dropIndex);
        this.saveColumnOrder();
      }
    },

    // Методи для керування колонками
    isColumnVisible(field: string): boolean {
      return this.dynamicColumns.some((col) => col.field === field);
    },

    toggleColumn(field: string) {
      const isVisible = this.isColumnVisible(field);

      if (isVisible) {
        // Приховуємо колонку
        this.dynamicColumns = this.dynamicColumns.filter((col) => col.field !== field);
      } else {
        // Показуємо колонку - додаємо в правильне місце згідно з allColumns
        const columnToAdd = this.allColumns.find((col) => col.field === field);
        if (columnToAdd) {
          const insertIndex = this.getInsertIndex(field);
          this.dynamicColumns.splice(insertIndex, 0, columnToAdd);
        }
      }

      this.saveColumnVisibility();
      this.saveColumnOrder();
    },

    getInsertIndex(field: string): number {
      // Знаходимо індекс в allColumns
      const allIndex = this.allColumns.findIndex((col) => col.field === field);

      // Знаходимо правильну позицію серед видимих колонок
      let insertIndex = 0;
      for (let i = 0; i < allIndex; i++) {
        if (this.isColumnVisible(this.allColumns[i].field)) {
          insertIndex++;
        }
      }

      return insertIndex;
    },

    showAllColumns() {
      this.dynamicColumns = [...this.allColumns];
      this.saveColumnVisibility();
      this.saveColumnOrder();
    },

    hideAllColumns() {
      // Залишаємо мінімум одну колонку (№ договора)
      this.dynamicColumns = [this.allColumns[0]];
      this.saveColumnVisibility();
      this.saveColumnOrder();
    },

    saveColumnVisibility() {
      try {
        const visibleColumns = this.dynamicColumns.map((col) => col.field);
        localStorage.setItem("tableVisibleColumns", JSON.stringify(visibleColumns));
      } catch (error) {
        console.error("Помилка збереження видимості колонок:", error);
      }
    },

    loadColumnVisibility() {
      const savedVisible = localStorage.getItem("tableVisibleColumns");
      if (savedVisible) {
        try {
          const visibleFields = JSON.parse(savedVisible);
          const visibleColumns = visibleFields
            .map((field: string) => this.allColumns.find((col) => col.field === field))
            .filter(Boolean) as TableColumn[];

          if (visibleColumns.length > 0) {
            this.dynamicColumns = visibleColumns;
          }
        } catch (error) {
          console.error("Помилка завантаження видимості колонок:", error);
        }
      }
    },

    saveColumnOrder() {
      try {
        const columnOrder = this.dynamicColumns.map((col) => col.field);
        localStorage.setItem("tableColumnOrder", JSON.stringify(columnOrder));
      } catch (error) {
        console.error("Помилка збереження порядку колонок:", error);
      }
    },

    loadColumnOrder() {
      const savedOrder = localStorage.getItem("tableColumnOrder");
      if (savedOrder) {
        try {
          const order = JSON.parse(savedOrder);

          const orderedColumns: TableColumn[] = [];

          // Спочатку додаємо колонки в збереженому порядку (тільки видимі)
          order.forEach((field: string) => {
            const column = this.allColumns.find((col) => col.field === field);
            const isVisible = this.dynamicColumns.some((col) => col.field === field);
            if (column && isVisible && !orderedColumns.find((c) => c.field === field)) {
              orderedColumns.push(column);
            }
          });

          // Потім додаємо видимі колонки, які не були в збереженому порядку
          this.dynamicColumns.forEach((column) => {
            if (!orderedColumns.find((c) => c.field === column.field)) {
              orderedColumns.push(column);
            }
          });

          if (orderedColumns.length > 0) {
            this.dynamicColumns = orderedColumns;
          }
        } catch (error) {
          console.error("Помилка завантаження порядку колонок:", error);
        }
      }
    },
  },
  mounted() {
    this.loadColumnVisibility(); // Спочатку завантажуємо видимість
    this.loadColumnOrder(); // Потім порядок

    // Закриваємо меню при кліку поза ним
    document.addEventListener("click", (e) => {
      if (!this.$el.contains(e.target)) {
        this.showColumnMenu = false;
      }
    });
  },
});
</script>

<style scoped>
.day-badge {
  background-color: #f3f4f6;
  color: #1f2937;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

.day-badge-green {
  background-color: #d1fae5;
  color: #065f46;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

.day-badge-orange {
  background-color: #ffedd5;
  color: #9a3412;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

.flex-col {
  display: flex;
  flex-direction: column;
}
.gap-1 {
  gap: 0.25rem;
}
.flex {
  display: flex;
}

.elem {
  width: 35px !important;
}

.wrapper {
  padding-bottom: 50px;
}

/* Стилі для меню колонок в стилі PrimeVue */
.column-controls {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.column-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.125rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(64, 64, 64, 0.15);
  z-index: 1000;
  min-width: 220px;
  max-height: 300px;
  overflow: hidden;
}

.menu-header {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.menu-items {
  max-height: 200px;
  overflow-y: auto;
  padding: 0.25rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  gap: 0.5rem;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-item input[type="checkbox"] {
  display: none;
}

.p-checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-checkbox-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #ced4da;
  border-radius: 3px;
  background: #ffffff;
  transition: all 0.2s;
  cursor: pointer;
}

.p-checkbox-box.p-checkbox-checked {
  background: #4caf50;
  border-color: #4caf50;
}

.p-checkbox-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #ced4da;
  border-radius: 3px;
  background: #ffffff;
  transition: all 0.2s;
  cursor: pointer;
}

.menu-item input:checked + .p-checkbox-label {
  background: #4caf50;
  border-color: #4caf50;
}

.p-checkbox-icon {
  color: #ffffff;
  font-size: 0.75rem;
}

.column-label {
  color: #495057;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
}

/* Кастомні стилі для PrimeVue кнопок */
.p-button.p-button-text.p-button-plain {
  color: #6c757d;
  background: transparent;
  border: 1px solid transparent;
}

.p-button.p-button-text.p-button-plain:hover {
  background: rgba(108, 117, 125, 0.04);
  color: #495057;
  border-color: transparent;
}

.p-button-success.p-button-text {
  color: #4caf50;
}

.p-button-success.p-button-text:hover {
  background: rgba(76, 175, 80, 0.04);
  color: #4caf50;
}

.p-button-danger.p-button-text {
  color: #f44336;
}

.p-button-danger.p-button-text:hover {
  background: rgba(244, 67, 54, 0.04);
  color: #f44336;
}

.p-button-sm {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}
</style>

<style>
.p-datatable .p-datatable-thead > tr > th {
  user-select: none;
}

.p-datatable .p-datatable-thead > tr > th.p-highlight {
  background-color: #e9ecef;
  border: 1px dashed #6c757d;
}
</style>
