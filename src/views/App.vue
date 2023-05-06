<template>
<div>
<TabMenu :model="items" @tab-change="tabchange" class="hide_on_mobile"/>

<div class="themaingrid mt-4">
<router-view/>
</div>
<TabMenu :model="items" @tab-change="tabchange" class="show_on_mobile fixed bottom-0"/>
<Toast />
<ConfirmDialog></ConfirmDialog>

</div>

</template>

<script>
export default {

  name: 'App',

  data () {
    return {
    	items: [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            to: '/'
        },
        {
            label: 'Expense Collections',
            icon: 'pi pi-fw pi-sitemap',
            to: '/expensecollections'
        },
        {
            label: 'Expenditure Items',
            icon: 'pi pi-fw pi-sort-alpha-down',
            to: '/expenditureitems'
        },
        {
            label: 'Expenses',
            icon: 'pi pi-fw pi-money-bill',
            to: '/expenses'
        },
        {
            label: 'Tags',
            icon: 'pi pi-fw pi-tags',
            to: '/tags'
        },
        {
            label: 'Reports',
            icon: 'pi pi-fw pi-chart-bar',
            to: '/reports'
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off',
            to: '/login'
        },
      ],
    }
  },
  mounted()
  {
  	
  	if(!this.$store.state.user)
  	{
  		this.$router.push({ path: '/login' })	
  	}
  	
  },
  methods:{
  	tabchange(data)
  	{
  		
  		if(data.index===6)
  		{
  			localStorage.removeItem("nesesauth");
  		}
  	}
  }
}
</script>

<style lang="css" scoped>
    .themaingrid{
        width: 99%;
        padding: 0 20px;
    }
</style>