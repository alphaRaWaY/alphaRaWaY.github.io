<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">alphaRaWaY</div>
      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/cnblog-kit">Cnblog Kit</RouterLink>
      </nav>
    </header>
    <main class="page-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid #e7e7e7;
  backdrop-filter: blur(6px);
}

.brand {
  font-weight: 800;
  letter-spacing: 0.04em;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav a {
  color: #333;
  text-decoration: none;
  font-weight: 600;
}

.nav a.router-link-active {
  color: #0f766e;
}

.page-main {
  max-width: 980px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}
</style>
