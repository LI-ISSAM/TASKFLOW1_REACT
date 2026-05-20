<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
interface Task { id: string; title: string; done: boolean; }
const route = useRoute();
const router = useRouter();
const task = ref<Task | null>(null);
onMounted(async () => {
try {
const res = await fetch('http://localhost:4000/tasks/' + route.params.id);
if (!res.ok) { router.push('/'); return; }
task.value = await res.json();

} catch { router.push('/'); }
});
</script>
<template>
<div v-if="task" style="padding: 2rem; max-width: 600px; margin: 0 auto;">
<div style="background: white; padding: 24px; border-radius: 12px;">
<h1 style="color: #42b883;">{{ task.title }}</h1>
<p>Statut : {{ task.done ? 'Terminée' : 'En cours' }}</p>
<RouterLink to="/" style="color: #42b883; margin-top: 20px; display:
inline-block;">Retour</RouterLink>
</div>
</div>
<p v-else style="padding: 2rem; color: #999;">Chargement...</p>
</template>