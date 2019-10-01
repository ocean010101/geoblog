<template>
  <div class="geo-blogs">
    <AppMenu />
    <div class="panes">
      <BlogMap />
    </div>
  </div>
</template>
<script>
import AppMenu from './AppMenu'
import BlogMap from './BlogMap'
export default {
  components: {
    AppMenu,
    BlogMap
  }
}
</script>
