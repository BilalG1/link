<template>
  <div>
    <div class="links-header">
      Links
    </div>
    <div class="pair-list-wrapper">
      <div v-for="nameLinkPair in nameLinkPairArray" :key="nameLinkPair.name" class="list-pair">
        <span class="pair-name">
          {{nameLinkPair.name + ')'}}
        </span>
        <span class="pair-link">
          {{nameLinkPair.link}}
        </span>
        <button @click="() => deletePair(nameLinkPair.name)" class="pair-delete">
          delete
        </button>
      </div>
    </div>

    <div class="new-pair">
      <div class="new-head">
        Add new pair: 
      </div>
      <div class="new-name">
        <span class="label-name">
          Name
        </span>
        <input class="input-name" v-model="newName"/>
      </div>
      <div class="new-link">
        <span class="label-link">
          Link
        </span>
        <input class="input-link" v-model="newLink"/>
      </div>
      <button @click="addPair" class="submit-new-pair">
        Add
      </button>
      <div class="new-error">
        {{newError}}
      </div>
    </div>
  </div>
</template>

<script>
const baseURL = 'https://link.bg-cloud.workers.dev/api/'

export default {
  data() {
    return {
      nameLinkPairArray: [],
      newName: '',
      newLink: '',
      newError: '',
    }
  },
  mounted() {
    fetch(baseURL+'allkeysandlinks')
    .then(res => res.json())
    .then(data => this.nameLinkPairArray = data)
  },
  methods: {
    deletePair(name) {
      const url = baseURL + 'link/' + name
      const config = {
        method: 'DELETE'
      }
      fetch(url, config)
      this.nameLinkPairArray = this.nameLinkPairArray.filter(item => item.name !== name)
    },

    addPair() {
      // to do: for loop of nameLinkPairArray to check for overwriting current link. maybe confirm that they want to delete another KV pair
      // posting multiple with same key shows multiple in frontend, but in KV they are being overwritten by each other
      // also check for valid url in this.newLink
      const name = this.newName
      let link = this.newLink
      this.newError = ''

      if (!name || !link){
        console.log('err, empty name or link in add')
        this.newError = 'invalid submission, name and link must be populated'
        return
      }

      link = this.isValidHttpUrl(this.newLink)
      if (!link){
        console.log('err, populated name and link, but invalid link')
        this.newError = 'link should be of form https://www.example.com'
        return
      }

      const url = baseURL + 'link/' + name
      const config = {
        method: 'POST',
        body: JSON.stringify(link)
      }
      fetch(url, config)
      this.nameLinkPairArray.push({ name, link })
      this.newName = ''
      this.newLink = ''
    },

    isValidHttpUrl(string) {
      let url;
      
      try {
        url = new URL(string);
      } catch (_) {
        return false;  
      }

      if (url.origin.startsWith('http://') || url.origin.startsWith('https://'))
        return url.origin
      else 
        return false
    }
  }
}
</script>

<style scoped>
.links-header{
  font-size: 30px;
  margin-bottom: 30px;
}
.pair-list-wrapper{
  text-align: left;
  margin: 0 auto;
  width: fit-content;
}
.list-pair{
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 5px;
}
.new-pair{
  margin-top: 30px;
}
.submit-new-pair{
  margin: 20px 0;
}
.pair-name{
  font-weight: 800;
  margin-right: 10px;
}
.pair-link {
   margin-right: 30px;
}
</style>