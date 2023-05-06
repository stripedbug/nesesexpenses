<template>
<div>

<div class="screen" v-if="!$store.state.appinitiated">

  <div class="loader">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>

</div>



<router-view />

</div>
</template>

<script>
export default {

  name: 'App',

  data () {
    return {
      
    }
  },
  mounted()
  {

    let user =  localStorage.getItem("nesesauth");
    console.log("app init user")
    console.log(user)
    if(!user)
    {      
      this.$router.push({ name: 'Login' })
    }
    else
    {
      this.$store.dispatch('setUser',user) 
    }

  }
}
</script>

<style lang="css" scoped>
  *{
    margin: 0;
    padding: 0;
  }
</style>