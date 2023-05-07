<template>
<div class="grid">


<div class="pageheader sticky col-12 top-0 z-5 p-2 text-white bg-indigo-500"><div class="grid">
<div class="col-12 "><h1 class=" font-bold m-0">Home</h1></div>
</div></div>

<div class="col-12 mt-3">
<h2>Very easy to use!</h2>
<br/>

<h2>1. First create collections like "Office" or "HR" on expense collections "<i class="pi pi-fw pi-sitemap text-xl"></i>" tab.</h2>

<h2>2. Then add expenditure items to the collectionslike "Building Management" or "Electricity" on expenditure items "<i class="pi pi-fw pi-sort-alpha-down text-xl"></i>"  tab.</h2>

<h2>3. Then start adding expenses on expenses "<i class="pi pi-fw pi-money-bill text-xl"></i>"  tab. You can upload invoices too.</h2>

<h2>- Optionally you can create custom tags for expenses on tags "<i class="pi pi-fw pi-tags text-xl"></i>"  tab to mark each expense.</h2>

<h2>4. Then visit reports <i class="pi pi-fw pi-chart-bar"></i>  tab to view and download expense reports..</h2>


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