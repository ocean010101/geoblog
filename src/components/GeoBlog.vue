<script>
import AppMenu from './AppMenu'
import BlogMap from './BlogMap'
import BlogContent from './content/BlogContent.vue'
export default {
  render (h) {
    return <div class="geo-blogs">
      <AppMenu />
      <div class="panes">
        <BlogMap />
        <BlogContent />
      </div>
    </div>
  }
}
</script>
