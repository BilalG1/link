<template>
  <div v-if="!error">
    Checking link status of '{{link}}'...
  </div>
  <div v-else>
    {{error}}
  </div>
</template>


<script>
export default {
  props: ['link'],
  
  data() {
    return {
      error: ''
    }
  },

  mounted() {
    const url = `https://link.bg-cloud.workers.dev/api/link/${this.link}`
    fetch(url)
      .then(res => res.text())
      .then(data => {
        console.log(data)
        if (data === 'No link found with given key')
          this.error = data
        else {
          if (!this.isValidHttpUrl(data))
            this.error = 'The forwarding string is not a valid url. data= '+data
          else
            window.location.replace(data)
        }
      })
  },

  methods: {
    isValidHttpUrl(string) {
      let url;
      
      try {
        url = new URL(string);
      } catch (_) {
        return false;  
      }

      // return url.protocol === "http:" || url.protocol === "https:";
      return url.origin.startsWith('http://') || url.origin.startsWith('https://')
    }
  }
}
</script>