<template>
  <header>
    <div class="ml-3 mb-4">
      <NuxtLink to="/" class="text-xl font-semibold">
        <span class="hidden xl:inline-block">Nonsocial</span>
        <span class="xl:hidden" title="Nonsocial">NS</span>
      </NuxtLink>
    </div>
    <nav v-if="user" class="grid gap-2">
      <NavMenuItem to="/" text="Home" exact>
        <template #icon="{ isActive }">
          <IconHome :active="isActive" />
        </template>
      </NavMenuItem>
      <NavMenuItem to="/explore" text="Explore" exact>
        <template #icon="{ isActive }">
          <IconHashtag :active="isActive" />
        </template>
      </NavMenuItem>
      <NavMenuItem to="/bookmarks" text="Bookmarks" exact>
        <template #icon="{ isActive }">
          <IconBookmark :active="isActive" />
        </template>
      </NavMenuItem>
      <NavMenuItem :to="`/${user?.username}`" text="Profile">
        <template #icon="{ isActive }">
          <IconPerson :active="isActive" />
        </template>
      </NavMenuItem>
      <ModalCompose v-slot="{ toggle }">
        <button
          class="cursor-pointer w-full mt-4 rounded-full p-3 bg-sky-600 hover:bg-sky-600/90 text-white font-bold"
          @click="toggle"
        >
          <IconPencil class="xl:sr-only" />
          <span class="sr-only xl:not-sr-only">Compose</span>
        </button>
      </ModalCompose>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { user } = useUser()
</script>