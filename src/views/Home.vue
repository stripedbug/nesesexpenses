<template>
<div class="grid">

<div class="col-10 md:col-11">
<InputText type="text" v-model="value" class="w-full p-inputtext-sm" />
</div>

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
  }
}
</script>

<style lang="css" scoped>
</style>