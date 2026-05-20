<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
<header style="background: #42b883; color: white; padding: 1rem 2rem; display: flex;
justify-content: space-between; align-items: center;">
<h2 style="margin: 0;">TodoVue</h2>
<nav style="display: flex; gap: 16px;">
<RouterLink to="/" style="color: white; text-decoration: none;">Tâches</RouterLink>
<RouterLink to="/about" style="color: white; text-decoration:
none;">About</RouterLink>
</nav>
</header>
<RouterView />
</template>