<template>
<div class="grid">



<div class="col-2 md:col-1">

</div>


</div>
</template>

<script>
export default {

  name: 'Home',

  data () {
    return {
    	value:null,
    }
  },
  mounted()
  {
    console.log("mount")
    this.$store.dispatch('SetAppInitiated',true) 
  }
}
</script>

<style lang="css" scoped>
</style>