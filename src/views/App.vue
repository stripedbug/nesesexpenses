<template>
<div>
<TabMenu :model="items" @tab-change="tabchange" class="hide_on_mobile"/>

<div class="themaingrid mt-4">
<router-view/>
</div>
<div class="show_on_mobile fixed bottom-0">
<TabMenu :model="items" @tab-change="tabchange" />
</div>
<Toast   position="bottom-right" class="speaicl_toast"/>
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

<style lang="css" >
    .themaingrid{
        width: 99%;
        padding: 0 20px;
        padding-bottom: 100px;
    }
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link{
        padding: 1.15rem;
        width: 100%;
        display: flex;
        justify-content: center;
        background-color: #ec4899 !important;
        color: #ffffff !important;
    }
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link{
        border-color: #ffffff !important;
        border-width: 0 0 4px 0;
    }
    .p-tabmenu{
        width: 100%;
    }
    .p-tabmenu .p-tabmenu-nav
    {
        background-color: #ec4899 !important;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
    }
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem
    {
        flex: 1;
        display: flex;
        justify-content: center;
        background-color: #ec4899 !important;
    }
    .p-toast-bottom-right
    {
      bottom: 50px !important;
    }
</style>