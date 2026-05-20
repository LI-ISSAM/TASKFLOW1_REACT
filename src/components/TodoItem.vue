<script setup lang="ts">
interface Task { id: string; title: string; done: boolean; }

defineProps<{ task: Task }>();
const emit = defineEmits<{
toggle: [task: Task];
delete: [id: string];
}>();
</script>

<template>
<li
style="display: flex; align-items: center; gap: 12px; padding: 14px; margin-bottom: 8px;
background: white; border-radius: 8px;">
<input type="checkbox" :checked="task.done" @change="emit('toggle', task)" />
<span :style="{
flex: 1,
textDecoration: task.done ? 'line-through' : 'none',
color: task.done ? '#999' : '#333'
}">
{{ task.title }}
</span>
<RouterLink :to="'/tasks/' + task.id" style="color: #42b883;">Détails</RouterLink>
<button @click="emit('delete', task.id)" style="background:none; border:none;
cursor:pointer;">Del</button>
</li>
</template>