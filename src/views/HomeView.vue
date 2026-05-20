<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTaskStore } from '@/stores/tasks';
import TodoItem from '@/components/TodoItem.vue';

const store = useTaskStore();
const newTitle = ref('');

onMounted(() => store.fetchTasks());

function handleAdd() {
if (!newTitle.value.trim()) return;
store.addTask(newTitle.value);
newTitle.value = '';
}
</script>

<template>
<div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
<h1 style="color: #42b883;">Mes Tâches ({{ store.tasks.length }})</h1>

<div style="display: flex; gap: 8px; margin: 16px 0;">
<input v-model="newTitle" placeholder="Nouvelle tâche..."
@keyup.enter="handleAdd"
style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #ddd;" />
<button @click="handleAdd"
style="padding: 10px 20px; background: #42b883; color: white; border: none;
border-radius: 6px;">
+ Ajouter
</button>
</div>

<p v-if="store.loading" style="color: #999;">Chargement...</p>
<p v-else-if="store.tasks.length === 0" style="color: #999;">Aucune tâche.</p>

<ul v-else style="list-style: none; padding: 0;">
<TodoItem
v-for="task in store.tasks"
:key="task.id"
:task="task"
@toggle="store.toggleTask"
@delete="store.deleteTask"
/>
</ul>
</div>
</template>